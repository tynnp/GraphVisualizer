let stack = [];

function updateAdjacencyList(nodeId, adjacencyList) {
    const list = d3.select("#list");
    const existingEntry = list.select(`#adj-list-${nodeId}`);

    if (existingEntry.empty()) {
        const paragraph = list.append("p").attr("id", `adj-list-${nodeId}`);

        paragraph.append("span")
            .attr("class", "adj-header-box")
            .text(`Đỉnh ${nodeId} kề:`);

        adjacencyList[nodeId].forEach((neighbor) => {
            const item = paragraph.append("span")
                .attr("class", "adj-item new") 
                .text(neighbor);

            setTimeout(() => item.classed("new", false), 500);
        });

        const adjacencyListElement = document.getElementById("adjacency-list");
        adjacencyListElement.scrollTop = adjacencyListElement.scrollHeight;
    }
}

function removeAdjacencyList(nodeId) {
    d3.select(`#adj-list-${nodeId}`).remove();
}

function updateStack() {
    const stackList = d3.select("#stack-list");
    stackList.html(""); 

    stack.forEach((item, index) => {
        const li = stackList.append("li")
            .text(item);

        if (index === stack.length - 1) {
            li.attr("class", "new-item");
        }
    });

    setTimeout(() => {
        stackList.selectAll("li").classed("new-item", false);
    }, 1000);
}

function removeFromStack() {
    if (stack.length > 0) {
        stack.pop(); 
        updateStack(); 

        const stackList = d3.select("#stack-list");
        stackList.selectAll("li").attr("class", "rise-up");

        setTimeout(() => {
            stackList.selectAll("li").classed("rise-up", false);
        }, 500); 
    }
}

export async function runTPLT(adjacencyList) {
    const visited = new Set();
    const components = []; 

    document.getElementById("run-btn").disabled = true;
    document.getElementById("create-graph-btn").disabled = true;

    for (let nodeId in adjacencyList) {
        nodeId = Number(nodeId);

        if (!visited.has(nodeId)) {
            console.log(`${nodeId} chưa được thăm!`);
            const component = [];
            await tplt(nodeId, adjacencyList, visited, component);
            components.push(component);
            updateTPLT(component);
        }
    }

    resetNodes();
    // Bật lại khi đã chạy xong
    document.getElementById("run-btn").disabled = false;
    document.getElementById("create-graph-btn").disabled = false;
}

async function tplt(nodeId, adjacencyList, visited, component) {
    console.log(`Duyệt đến ${nodeId}`);

    if (visited.has(nodeId)) {
        return;
    }

    d3.select(`#node-${nodeId} circle`)
        .transition()
        .duration(500)
        .attr("stroke", "dodgerblue");

    d3.select(`#node-${nodeId} text`)
        .transition()
        .duration(500)
        .attr("fill", "dodgerblue");

    visited.add(nodeId);
    component.push(nodeId); 
    stack.push(nodeId);
    updateStack(); 
    updateTPLT(component);
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
    for (const neighbor of adjacencyList[nodeId]) {
        if (!visited.has(neighbor)) {
            await new Promise(resolve => setTimeout(() => tplt(neighbor, adjacencyList, visited, component).then(resolve), 1000));
        }
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); 

    stack.pop(); 
    updateStack(); 
    removeAdjacencyList(nodeId);

    if (stack.length === 0) {
        document.getElementById("run-btn").disabled = false;
        document.getElementById("create-graph-btn").disabled = false;
    }
}

function updateTPLT(component) {
    const tpltList = d3.select("#tplt-list");
        tpltList.html(""); 

    component.forEach((nodeId, index) => {
        const li = tpltList.append("li")
            .text(`Đỉnh: ${nodeId}`); 
        if (index === component.length - 1) {
            li.attr("class", "new-item");
        }

        setTimeout(() => {
            tpltList.selectAll("li").classed("new-item", false);
        }, 1000);
    });
}

function resetNodes() {
    d3.selectAll("circle")
        .transition()
        .duration(500)
        .attr("stroke", "black")
        .attr("fill", "white");

    d3.selectAll("text")
        .transition()
        .duration(500)
        .attr("fill", "black");
}

export { tplt, updateStack, updateAdjacencyList, removeAdjacencyList };
