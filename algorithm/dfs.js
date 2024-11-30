let stack = [];

function updateAdjacencyList(nodeId, adjacencyList) {
    const list = d3.select("#list");
    const existingEntry = list.select(`#adj-list-${nodeId}`);

    if (existingEntry.empty()) {
        const neighbors = adjacencyList[nodeId].join(", ");
        list.append("p")
            .attr("id", `adj-list-${nodeId}`)
            .text(`đỉnh ${nodeId} kề đỉnh ${neighbors}`);
    }
}

function removeAdjacencyList(nodeId) {
    d3.select(`#adj-list-${nodeId}`).remove();
}

function updateStack() {
    const stackList = d3.select("#stack-list");
    stackList.html("");
    stack.forEach((item) => {
        stackList.append("li").text(item);
    });
}

export async function runDFS(adjacencyList) {
    const visited = new Set();

    for (let nodeId in adjacencyList) {
        nodeId = Number(nodeId);

        if (!visited.has(nodeId)) {
            console.log(`${nodeId} chưa được thăm!`);
            await dfs(nodeId, adjacencyList, visited);
        }
    }
}

async function dfs(nodeId, adjacencyList, visited) {
    console.log(`Duyệt đến ${nodeId}`);

    if (visited.has(nodeId))
        return;

    d3.select(`#node-${nodeId} circle`)
        .transition()
        .duration(500)
        .attr("stroke", "dodgerblue");

    d3.select(`#node-${nodeId} text`)
        .transition()
        .duration(500)
        .attr("fill", "dodgerblue"); 

    visited.add(nodeId);
    stack.push(nodeId);
    updateStack(); 
    updateAdjacencyList(nodeId, adjacencyList); 

    await new Promise(resolve => setTimeout(resolve, 1000)); 
    document.getElementById("create-graph-btn").disabled = true;

    d3.select(`#node-${nodeId} circle`)
        .transition()
        .duration(500)
        .attr("stroke", "limegreen"); 

    d3.select(`#node-${nodeId} text`)
        .transition()
        .duration(500)
        .attr("fill", "limegreen"); 

    for (const neighbor of adjacencyList[nodeId]) 
        if (!visited.has(neighbor)) 
            await new Promise(resolve => setTimeout(() => dfs(neighbor, adjacencyList, visited).then(resolve), 1000));

    await new Promise(resolve => setTimeout(resolve, 1000)); 

    stack.pop(); 
    updateStack(); 
    removeAdjacencyList(nodeId);

    if (stack.length === 0) 
        document.getElementById("create-graph-btn").disabled = false;
}

export { dfs, updateStack, updateAdjacencyList, removeAdjacencyList };
