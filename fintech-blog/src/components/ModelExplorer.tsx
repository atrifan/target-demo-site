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
  const [postResponses, setPostResponses] = useState<{ [key: string]: any }>({});

  const lambdaUrl =
    "https://t7mdhjxlqv6mttyehb3jfjagfa0mznfe.lambda-url.us-west-2.on.aws/";

  useEffect(() => {
    if (!campaignId || campaignId === "") {
      return;
    }
    const fetchModels = async () => {
      try {
        const body = {
          client_code: tenant,
          campaign_id: campaignId,
          action: "cors",
          url: "https://internal-zeus.personalization.prod.target.adobe.net/model",
        };

        const response = await axios.get(lambdaUrl, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: false,
        });
        const data = response.data;

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

  const toggleCollapse = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    if (!expanded[id]) {
      handlePost(id);
    }
  };

  const handlePost = async (modelId: string) => {
    try {
      const response = await axios.get(`${lambdaUrl}?model_id=${modelId}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: false,
      });
      //from response.data.result.modules every module from modules remove key rfdata

      setPostResponses((prev) => ({ ...prev, [modelId]: response.data }));
    } catch (error) {
      console.error("Error in Lambda POST request:", error);
      setPostResponses((prev) => ({ ...prev, [modelId]: { error: "Error fetching data" } }));
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Model Explorer</h3>
      {models.map((model) => {
        const { id, updateTime } = model;
        const friendlyDate = new Date(updateTime).toLocaleString();
        const postResponse = postResponses[id];

        return (
          <div key={id} style={styles.card}>
            <div
              style={styles.cardHeader}
              onClick={() => toggleCollapse(id)}
            >
              {id} - {friendlyDate}
            </div>
            <Collapse isOpened={expanded[id]}>
              <div style={styles.cardContent}>
                <JSONPretty data={model}></JSONPretty>
                {postResponse && (
                  <>
                    <h4>POST Response:</h4>
                    <JSONPretty data={postResponse}></JSONPretty>
                  </>
                )}
              </div>
            </Collapse>
          </div>
        );
      })}
    </div>
  );
};

export default ModelExplorer;

const styles = {
  container: {
    position: "fixed" as "fixed",
    bottom: "10px",
    right: "10px",
    width: "400px", // Increased size
    backgroundColor: "#f8f9fa",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    padding: "1rem",
    overflowY: "auto" as "auto",
    maxHeight: "80vh", // Adjusted height for better visibility
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
