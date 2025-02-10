class TargetRenderer {
  constructor() {
  }
  render() {
  }

  getOffer(mboxNames?: string) {
    window.alloy("sendEvent", {
      "decisionScopes": mboxNames,
      "data": {
        "__adobe": {
          "target": {
            "entity.id": "123",
            "entity.genre": "Drama"
          }
        }
      }
    }).then(function(result: any) {
      var retrievedPropositions = result.propositions;

      // Render offer (proposition) to the #hero-banner selector by supplying extra metadata
      return window.alloy("applyPropositions", {
        "propositions": retrievedPropositions,
        "metadata": {
          // Specify each regional mbox or scope name along with a selector and actionType
          "Homepage_regional_mbox": {
            "selector": ".tracking-tight",
            "actionType": "replaceHtml"
          }
        }
      }).then(function(applyPropositionsResult: any) {
        var renderedPropositions = applyPropositionsResult.propositions;

        // Send the display notifications via sendEvent command
        window.alloy("sendEvent", {
          "xdm": {
            "eventType": "decisioning.propositionDisplay",
            "_experience": {
              "decisioning": {
                "propositions": renderedPropositions
              }
            }
          }
        });
      });
    });
  }
}