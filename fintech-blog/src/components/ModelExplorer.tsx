import React, { useState, useEffect } from "react";
import axios from "axios";
import { Collapse } from "react-collapse";
import JSONPretty from "react-json-pretty";
import "react-json-pretty/themes/monikai.css";

interface Props {
  campaignId: string;
  tenant: string;
}

const ModelExplorer: React.FC<Props> = ({ campaignId, tenant }) => {
  const [models, setModels] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const lambdaUrl =
    "https://t7mdhjxlqv6mttyehb3jfjagfa0mznfe.lambda-url.us-west-2.on.aws/";

  // Fetch data from Lambda's /model endpoint using the CORS action
  useEffect(() => {
    if (!campaignId || campaignId == "") {
      return;
    }
    const fetchModels = async () => {
      try {
        const body = {
          client_code: tenant,
          campaign_id: campaignId,
          action: "cors",  // Specify 'cors' action
          url: "https://internal-zeus.personalization.prod.target.adobe.net/model",  // Pass the Zeus URL
        };

        // Make the request to Lambda
        const response = await axios.post(lambdaUrl, body, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: false, // Set to `true` if you need to include cookies or credentials
        });
        const data = response.data;

        // Handle the response and filter models based on tenant and campaignId
        if (data && Array.isArray(data)) {
          const filteredModels = data.filter((item: any) => {
            const [, tenantCode, campaignCode] = item.id.split(":");
            return tenantCode === tenant && campaignCode === campaignId;
          });
          setModels(filteredModels);
        }
      } catch (error) {
        console.error("Error fetching models from Lambda:", error);
      }
    };

    fetchModels();
  }, [campaignId, tenant]);

  // Toggle collapse state
  const toggleCollapse = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Handle the POST request to Lambda (same as before)
  const handlePost = async (modelId: string) => {
    try {
      const body = {
        client_code: tenant,
        campaign_id: campaignId,
        model_id: modelId,
        zeus_url: "https://internal-zeus.personalization.prod.target.adobe.net",
        action: "download",
      };
      const response = await axios.post(lambdaUrl, body, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false, // Set to `true` if you need to include cookies or credentials
      });
      console.log("Response from Lambda:", response.data);
    } catch (error) {
      console.error("Error in Lambda POST request:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Model Explorer</h3>
      {models.map((model) => {
        const { id, updateTime } = model;
        const friendlyDate = new Date(updateTime).toLocaleString();

        return (
          <div key={id} style={styles.card}>
            <div
              style={styles.cardHeader}
              onClick={() => {
                toggleCollapse(id);
                handlePost(id); // Trigger POST request when expanded
              }}
            >
              {id} - {friendlyDate}
            </div>
            <Collapse isOpened={expanded[id]}>
              <div style={styles.cardContent}>
                <JSONPretty data={model}></JSONPretty>
              </div>
            </Collapse>
          </div>
        );
      })}
    </div>
  );
};

export default ModelExplorer;

// Styles (unchanged)
const styles = {
  container: {
    position: "fixed" as "fixed",
    top: "10px",
    right: "10px",
    width: "300px",
    backgroundColor: "#f8f9fa",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    padding: "1rem",
    overflowY: "auto" as "auto",
    maxHeight: "90vh",
    zIndex: 1000,
  },
  header: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    textAlign: "center" as "center",
    color: "#333",
  },
  card: {
    marginBottom: "1rem",
    border: "1px solid #ddd",
    borderRadius: "6px",
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  cardHeader: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "0.5rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
  cardContent: {
    padding: "0.5rem",
    backgroundColor: "#f1f1f1",
  },
};
