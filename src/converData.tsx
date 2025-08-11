export const convertData = (
  nodes: any[] | undefined,
  edges: any[] | undefined
) => {
  const newNodes: any[] = [];
  const newEdges: any[] = [];
  if (nodes !== undefined) {
    nodes.forEach((item) => {
      let newNode = { id:item.id, label:item.oriLabel, size:item.size, color:item.color };
      
      newNodes.push(newNode);
    });
  }
  if (edges !== undefined) {
    edges.forEach((item) => {
      let newEdge = {
        id: item.id,
        label: item.label,
        source: item.source,
        target: item.target,
      };
      newEdges.push(newEdge);
    });
  }

  return { nodes: newNodes, edges: newEdges };
};
