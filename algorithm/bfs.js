let queue = [];

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


function updateQueue() {
    const queueList = d3.select("#queue-list");
    queueList.html(""); 

    queue.forEach((item, index) => {
        const li = queueList.append("li")
            .text(item);

        if (index === 0) {
            li.attr("class", "new-item");
        }
    });

    setTimeout(() => {
        queueList.selectAll("li").classed("new-item", false);
    }, 1000);
}

function removeFromQueue() {
    if (queue.length > 0) {
        queue.shift();
        updateQueue(); 

        const queueList = d3.select("#queue-list");
        queueList.selectAll("li").attr("class", "rise-up");

        setTimeout(() => {
            queueList.selectAll("li").classed("rise-up", false);
        }, 500); 
    }
}

export async function runBFS(adjacencyList) {
    const visited = new Set();

    // Vô hiệu hóa nút "Chạy thuật toán" và "Tạo đồ thị" khi bắt đầu
    document.getElementById("run-btn").disabled = true;
    document.getElementById("create-graph-btn").disabled = true;

    for (let nodeId in adjacencyList) {
        nodeId = Number(nodeId);

        if (!visited.has(nodeId)) {
            console.log(`${nodeId} chưa được thăm!`);
            await bfs(nodeId, adjacencyList, visited);
        }
    }
    resetNodes();

    // Bật lại khi đã chạy xong
    document.getElementById("run-btn").disabled = false;
    document.getElementById("create-graph-btn").disabled = false;
}

async function bfs(startNodeId, adjacencyList, visited) {
    console.log(`Bắt đầu duyệt từ ${startNodeId}`);
    queue.push(startNodeId);
    updateQueue();

    visited.add(startNodeId);
    updateAdjacencyList(startNodeId, adjacencyList);

    while (queue.length > 0) {
        const nodeId = queue[0];
        console.log(`Duyệt đến ${nodeId}`);

        d3.select(`#node-${nodeId} circle`)
            .transition()
            .duration(500)
            .attr("stroke", "dodgerblue");

        d3.select(`#node-${nodeId} text`)
            .transition()
            .duration(500)
            .attr("fill", "dodgerblue");

        await new Promise(resolve => setTimeout(resolve, 1000));

        for (const neighbor of adjacencyList[nodeId]) {
            if (!visited.has(neighbor)) {
                console.log(`Hàng xóm ${neighbor} chưa được thăm`);
                visited.add(neighbor);
                queue.push(neighbor);
                updateQueue();
                updateAdjacencyList(neighbor, adjacencyList);

                d3.select(`#node-${neighbor} circle`)
                    .transition()
                    .duration(500)
                    .attr("stroke", "limegreen");

                d3.select(`#node-${neighbor} text`)
                    .transition()
                    .duration(500)
                    .attr("fill", "limegreen");
            }
        }

        d3.select(`#node-${nodeId} circle`)
            .transition()
            .duration(500)
            .attr("stroke", "limegreen");

        d3.select(`#node-${nodeId} text`)
            .transition()
            .duration(500)
            .attr("fill", "limegreen");

        removeFromQueue();
        removeAdjacencyList(nodeId);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}
// khi chạy xong thuật toán đưa màu của các node về ban đầu
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

export { bfs, updateQueue, updateAdjacencyList, removeAdjacencyList};