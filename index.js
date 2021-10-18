document.querySelector("#root").innerHTML = `<h1>Hello</h1>`;

const includesList = (array, valueStart, valueEnd) => {
    for (let i = 0; i <= array[0].length; i++) {
        if (array[0][i] === valueStart && array[1][i] === valueEnd) return true;
    }
    return false;
};

const arrayTemplate = [],
    templateString =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    arrayListOfRibs = [];

for (let i = 0; i <= Math.floor(Math.random() * 20); i++)
    arrayTemplate[i] = {
        vizited: false,
        value: Math.floor(Math.random() * 100),
    };
let arrayGraph = arrayTemplate.map((item,index) => {
    let name = "";
    for (let i = 0; i < 10; i++)
        name = `${name}${templateString.charAt(
            Math.floor(Math.random() * templateString.length)
        )}`;
    return {
        ...item,
        indexVer: index,
        name,
    };
});

let i = 0;
while (arrayListOfRibs.length !== arrayGraph.length) {
    const len = Math.floor(Math.random() * arrayGraph.length);
    if (len !== 0) {
        arrayListOfRibs.push([]);
        for (let j = 0; j < len; j++) {
            const v = Math.floor(Math.random() * arrayGraph.length);
            if (v !== i && !arrayListOfRibs[i].includes(v)) {
                arrayListOfRibs[i].push(v);
            } else {
                j--;
            }
        }
        i++;
    }
}

function dfs(graph, adj, v, t) {
    const indexOfV = graph.indexOf(v);
    if (v.value === t)
        return {
            ...v,
            vizited: true,
            index: graph.indexOf(v),
            possible: true,
        };
    if (v.vizited && indexOfV === adj[indexOfV].length - 1)
        return {
            possible: false,
        };
    v.vizited = true;
    for (let neighboor of adj[indexOfV]) {
        if (!graph[neighboor].vizited) {
            let reached = dfs(graph, adj, graph[neighboor], t);
            if (reached) return reached;
        }
    }
    return {
        possible: false,
    };
}

function bfs(graph, adj, v, t) {
    const queue = [];

    queue.push(v);
    v.vizited = true;
    while (queue.length > 0) {
        let s = queue.shift();
        const indexOfS = graph.indexOf(s);
        for (let neighboor of adj[indexOfS]) {
            if (!graph[neighboor].vizited) {
                queue.push(graph[neighboor]);

                graph[neighboor].vizited = true;

                if (graph[neighboor].value === t)
                    return {
                        ...graph[neighboor],
                        index: neighboor,
                        possible: true,
                    };
            }
        }
    }
    return {
        possible: false,
    };
}

document.querySelector(".arrayGraph").innerHTML = `<div>
    <h2>Граф</h2>
    <pre>
        ${JSON.stringify(arrayGraph, undefined, "\n")}
    </pre>
    <h3>Количество вершин</h3>
    <p>${arrayGraph.length}</p>
</div>`;
document.querySelector(
    ".arrayListOfRibs"
).innerHTML = `<h2>Список смежных</h2><hr /><div></div>`;
arrayListOfRibs.forEach((item, index) => {
    const pre = document.createElement("div");
    pre.innerHTML = `<span class="inline-block margin-right">${index}</span>
    <div class="inline-block">
    ${JSON.stringify(item)}
    </div>
    <hr />`;
    document.querySelector(".arrayListOfRibs div").append(pre);
});

const initialGraph = JSON.stringify(arrayGraph);

const graph = document.querySelector(".graph");

graph.style.gridTemplateColumns = `repeat(${arrayGraph.length}, 1fr)`;
graph.style.gridTemplateRows = `repeat(${arrayGraph.length}, 1fr)`;

document.querySelector(".form__submit").addEventListener("click", () => {
    const result = document.querySelector(".form__result"),
        from = document.querySelector("#from"),
        to = document.querySelector("#to");

    const resDFS = dfs(
        arrayGraph,
        arrayListOfRibs,
        arrayGraph[from.value],
        arrayGraph[to.value].value
    );
    arrayGraph = JSON.parse(initialGraph);

    const resBFS = bfs(
        arrayGraph,
        arrayListOfRibs,
        arrayGraph[from.value],
        arrayGraph[to.value].value
    );
    result.innerHTML = `
    <div class="form__div">
        <h3>Поиск в глубину</h3>
        <pre>${JSON.stringify(resDFS, undefined, "\n")}</pre>
    </div>
    <div class="form__div">
        <h3>Поиск в ширину</h3>
        <pre>${JSON.stringify(resBFS, undefined, "\n")}</pre>
    </div>
    `;
    const points = arrayGraph.map((item, index) => {
        const point = document.createElement("div");
        point.classList.add("graph-point");
        if (item.vizited) {
            point.classList.add("graph-point--vizited");
        }
        point.style.gridColumnStart = `${index + 1}`;
        point.style.gridRowStart = `${index + 1}`;
        point.textContent = `${index}`;
        return point;
    });
    points[resDFS.index].classList.add("graph-point--result");
    points.forEach((point) => graph.append(point));
});

document.querySelector(".form__cansel").addEventListener("click", () => {
    arrayGraph = JSON.parse(initialGraph);
});
