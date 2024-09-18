// export const data = {
//   nodes: [
//     {
//       id: '1',
//       label: '公司1'
//     },
//     {
//       id: '2',
//       label: '公司2'
//     },
//     {
//       id: '3',
//       label: '公司3'
//     },
//     {
//       id: '4',
//       label: '公司4'
//     },
//     {
//       id: '5',
//       label: '公司5'
//     },
//     {
//       id: '6',
//       label: '公司6'
//     },
//     {
//       id: '7',
//       label: '公司7'
//     },
//     {
//       id: '8',
//       label: '公司8'
//     },
//     {
//       id: '9',
//       label: '公司9'
//     }
//   ],
//   edges: [
//     {
//       source: '1',
//       target: '2',
//       data: {
//         type: 'name1',
//         amount: '100,000,000,00 元',
//         date: '2019-08-03'
//       }
//     },
//     {
//       source: '1',
//       target: '3',
//       data: {
//         type: 'name2',
//         amount: '100,000,000,00 元',
//         date: '2019-08-03'
//       }
//     },
//     {
//       source: '2',
//       target: '5',
//       data: {
//         type: 'name1',
//         amount: '100,000,000,00 元',
//         date: '2019-08-03'
//       }
//     },
//     {
//       source: '5',
//       target: '6',
//       data: {
//         type: 'name2',
//         amount: '100,000,000,00 元',
//         date: '2019-08-03'
//       }
//     },
//     {
//       source: '3',
//       target: '4',
//       data: {
//         type: 'name3',
//         amount: '100,000,000,00 元',
//         date: '2019-08-03'
//       }
//     },
//     {
//       source: '4',
//       target: '7',
//       data: {
//         type: 'name2',
//         amount: '100,000,000,00 元',
//         date: '2019-08-03'
//       }
//     },
//     {
//       source: '1',
//       target: '8',
//       data: {
//         type: 'name2',
//         amount: '100,000,000,00 元',
//         date: '2019-08-03'
//       }
//     },
//     {
//       source: '1',
//       target: '9',
//       data: {
//         type: 'name3',
//         amount: '100,000,000,00 元',
//         date: '2019-08-03'
//       }
//     }
//   ]
// };
export const data = {
  nodes: [{ id: 'startNode', x: 50, y: 200, label: 'Start', clazz: 'start' },
    { id: 'taskNode1', x: 200, y: 200, label: 'Supervisor', assigneType: 'person', assigneValue: 'admin', isSequential:false, clazz: 'userTask' },
    { id: 'taskNode2', x: 400, y: 200, label: 'Manager', assigneType: 'person', assigneValue: 'admin', isSequential:false, clazz: 'userTask' },
    { id: 'decisionNode', x: 400, y: 320, label: 'Cost > 1000', clazz: 'gateway' },
    { id: 'taskNode3', x: 400, y: 450, label: 'CEO', clazz: 'userTask' },
    { id: 'endNode', x: 600, y: 320, label: 'End', clazz: 'end' }],
  edges: [{ source: 'startNode', target: 'taskNode1', sourceAnchor:1, targetAnchor:3, clazz: 'flow' },
    { source: 'taskNode1', target: 'endNode', sourceAnchor:0, targetAnchor:0, clazz: 'flow' },
    { source: 'taskNode1', target: 'taskNode2', sourceAnchor:1, targetAnchor:3, clazz: 'flow' },
    { source: 'taskNode2', target: 'decisionNode', sourceAnchor:1, targetAnchor:0, clazz: 'flow' },
    { source: 'taskNode2', target: 'taskNode1', sourceAnchor:2, targetAnchor:2, clazz: 'flow' },
    { source: 'decisionNode', target: 'taskNode3', sourceAnchor:2, targetAnchor:0, clazz: 'flow' },
    { source: 'decisionNode', target: 'endNode', sourceAnchor:1, targetAnchor:2, clazz: 'flow'},
    { source: 'taskNode3', target: 'endNode', sourceAnchor:1, targetAnchor:1, clazz: 'flow' },
    { source: 'taskNode3', target: 'taskNode1', sourceAnchor:3, targetAnchor:2, clazz: 'flow'},]
}
// export const data = {
//   nodes: [
//     {
//       id: '1',
//       dataType: 'alps',
//       name: 'alps_file1',
//       conf: [
//         {
//           label: 'conf',
//           value: 'pai_graph.conf',
//         },
//         {
//           label: 'dot',
//           value: 'pai_graph.dot',
//         },
//         {
//           label: 'init',
//           value: 'init.rc',
//         },
//       ],
//     },
//     {
//       id: '2',
//       dataType: 'alps',
//       name: 'alps_file2',
//       conf: [
//         {
//           label: 'conf',
//           value: 'pai_graph.conf',
//         },
//         {
//           label: 'dot',
//           value: 'pai_graph.dot',
//         },
//         {
//           label: 'init',
//           value: 'init.rc',
//         },
//       ],
//     },
//     {
//       id: '3',
//       dataType: 'alps',
//       name: 'alps_file3',
//       conf: [
//         {
//           label: 'conf',
//           value: 'pai_graph.conf',
//         },
//         {
//           label: 'dot',
//           value: 'pai_graph.dot',
//         },
//         {
//           label: 'init',
//           value: 'init.rc',
//         },
//       ],
//     },
//     {
//       id: '4',
//       dataType: 'sql',
//       name: 'sql_file1',
//       conf: [
//         {
//           label: 'conf',
//           value: 'pai_graph.conf',
//         },
//         {
//           label: 'dot',
//           value: 'pai_graph.dot',
//         },
//         {
//           label: 'init',
//           value: 'init.rc',
//         },
//       ],
//     },
//     {
//       id: '5',
//       dataType: 'sql',
//       name: 'sql_file2',
//       conf: [
//         {
//           label: 'conf',
//           value: 'pai_graph.conf',
//         },
//         {
//           label: 'dot',
//           value: 'pai_graph.dot',
//         },
//         {
//           label: 'init',
//           value: 'init.rc',
//         },
//       ],
//     },
//     {
//       id: '6',
//       dataType: 'feature_etl',
//       name: 'feature_etl_1',
//       conf: [
//         {
//           label: 'conf',
//           value: 'pai_graph.conf',
//         },
//         {
//           label: 'dot',
//           value: 'pai_graph.dot',
//         },
//         {
//           label: 'init',
//           value: 'init.rc',
//         },
//       ],
//     },
//     {
//       id: '7',
//       dataType: 'feature_etl',
//       name: 'feature_etl_1',
//       conf: [
//         {
//           label: 'conf',
//           value: 'pai_graph.conf',
//         },
//         {
//           label: 'dot',
//           value: 'pai_graph.dot',
//         },
//         {
//           label: 'init',
//           value: 'init.rc',
//         },
//       ],
//     },
//     {
//       id: '8',
//       dataType: 'feature_extractor',
//       name: 'feature_extractor',
//       conf: [
//         {
//           label: 'conf',
//           value: 'pai_graph.conf',
//         },
//         {
//           label: 'dot',
//           value: 'pai_graph.dot',
//         },
//         {
//           label: 'init',
//           value: 'init.rc',
//         },
//       ],
//     },
//   ],
//   edges: [
//     {
//       source: '1',
//       target: '2',
//     },
//     {
//       source: '1',
//       target: '3',
//     },
//     {
//       source: '2',
//       target: '4',
//     },
//     {
//       source: '3',
//       target: '4',
//     },
//     {
//       source: '4',
//       target: '5',
//     },
//     {
//       source: '5',
//       target: '6',
//     },
//     {
//       source: '6',
//       target: '7',
//     },
//     {
//       source: '6',
//       target: '8',
//     },
//   ],
// };
