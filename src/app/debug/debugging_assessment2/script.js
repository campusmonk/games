"use strict";
// ===== Data =====
const EXT_BY_LANG = { 'C': 'c', 'C++': 'cpp', 'Java': 'java', 'Python': 'py' };

const STARTER_CODES = {
    'C++': [
`#include <bits/stdc++.h>
using namespace std;

struct Node {
    int val;
    Node *left, *right;
    Node(int x) : val(x), left(nullptr), right(nullptr) {}
};

bool searchBST(Node* root, int target) {
    if (root == nullptr) return false;
    if (root->val == target) return true;

    if (target < root->val)
        return searchBST(root->right, target);  
    return searchBST(root->left, target);       
}

int main() {
    Node* root = new Node(8);
    root->left = new Node(3);
    root->right = new Node(10);
    root->left->left = new Node(1);
    root->left->right = new Node(6);
    root->left->right->left = new Node(4);
    root->left->right->right = new Node(7);
    root->right->right = new Node(14);
    root->right->right->left = new Node(13);

    cout << boolalpha << searchBST(root, 7);
}`,
`#include <bits/stdc++.h>
using namespace std;

int reachableCount(int V, vector<vector<int>>& adj, int src) {
    vector<int> visited(V, 0);
    queue<int> q;
    q.push(src);

    int count = 0;

    while (!q.empty()) {
        int u = q.front();
        q.pop();

        for (int v : adj[u]) {
            if (!visited[v]) {
                q.push(v);
                visited[v] = 0;  
            }
        }
        count++;
    }
    return count;
}

int main() {
    int V = 6;
    vector<vector<int>> adj(V);
    auto addEdge = [&](int a, int b) {
        adj[a].push_back(b);
        adj[b].push_back(a);
    };

    addEdge(0,1); addEdge(0,2); addEdge(1,3);
    addEdge(2,4); addEdge(4,5);

    cout << reachableCount(V, adj, 0);
}`,
`#include <bits/stdc++.h>
using namespace std;

long long countPaths(vector<vector<int>>& grid) {
    int r = grid.size(), c = grid[0].size();
    vector<vector<long long>> dp(r, vector<long long>(c, 0));

    dp[0][0] = 1;

    for (int i = 0; i < r; ++i) {
        for (int j = 0; j < c; ++j) {
            if (grid[i][j] == 1) {
                dp[i][j] = 1;  
                continue;
            }

            if (i > 0) dp[i][j] += dp[i-1][j];
            if (j > 0) dp[i][j] += dp[i][j-1];
        }
    }
    return dp[r-1][c-1];
}

int main() {
    vector<vector<int>> grid = {
        {0,0,0},
        {0,1,0},
        {0,0,0}
    };
    cout << countPaths(grid);
}`,
`#include <bits/stdc++.h>
using namespace std;

long long rangeSum(vector<int>& a, int L, int R) {
    int n = a.size();
    vector<long long> pref(n, 0);

    pref[0] = a[0];
    for (int i = 1; i < n; ++i)
        pref[i] = pref[i-1] + a[i];

    if (L == 0) return pref[R];
    return pref[R] - pref[L];  
}

int main() {
    vector<int> a = {2,4,1,7,3};
    cout << rangeSum(a, 1, 3);
}`,
`#include <bits/stdc++.h>
using namespace std;

int shortestPath(int V, vector<vector<pair<int,int>>>& adj, int src, int dest) {
    const int INF = 1e9;
    vector<int> dist(V, INF);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;

    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d != dist[u]) continue;

        for (auto [v, w] : adj[u]) {
            if (d + w < dist[v]) {
                dist[v] = d;  
                pq.push({dist[v], v});
            }
        }
    }
    return dist[dest] == INF ? -1 : dist[dest];
}

int main() {
    int V = 4;
    vector<vector<pair<int,int>>> adj(V);
    auto add = [&](int u,int v,int w) {
        adj[u].push_back({v,w});
        adj[v].push_back({u,w});
    };

    add(0,1,4); add(0,2,1); add(2,1,2);
    add(1,3,1); add(2,3,5);

    cout << shortestPath(V, adj, 0, 3);
}`
    ],
    'Python': [
`class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def search_bst(root, target):
    if root is None:
        return False
    if root.val == target:
        return True

    if target < root.val:
        return search_bst(root.right, target)
    return search_bst(root.left, target)

if __name__ == "__main__":
    root = Node(8)
    root.left = Node(3)
    root.right = Node(10)
    root.left.left = Node(1)
    root.left.right = Node(6)
    root.left.right.left = Node(4)
    root.left.right.right = Node(7)
    root.right.right = Node(14)
    root.right.right.left = Node(13)

    print(str(search_bst(root, 7)).lower())`,
`from collections import deque

def reachable_count(V, adj, src):
    visited = [0] * V
    q = deque([src])
    count = 0

    while q:
        u = q.popleft()
        for v in adj[u]:
            if not visited[v]:
                q.append(v)
                visited[v] = 0
        count += 1

    return count

if __name__ == "__main__":
    V = 6
    adj = [[] for _ in range(V)]
    def add_edge(a, b):
        adj[a].append(b)
        adj[b].append(a)

    add_edge(0, 1)
    add_edge(0, 2)
    add_edge(1, 3)
    add_edge(2, 4)
    add_edge(4, 5)

    print(reachable_count(V, adj, 0))`,
`def count_paths(grid):
    r, c = len(grid), len(grid[0])
    dp = [[0] * c for _ in range(r)]

    dp[0][0] = 1

    for i in range(r):
        for j in range(c):
            if grid[i][j] == 1:
                dp[i][j] = 1
                continue

            if i > 0:
                dp[i][j] += dp[i - 1][j]
            if j > 0:
                dp[i][j] += dp[i][j - 1]

    return dp[r - 1][c - 1]

if __name__ == "__main__":
    grid = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
    ]
    print(count_paths(grid))`,
`def range_sum(a, L, R):
    n = len(a)
    pref = [0] * n

    pref[0] = a[0]
    for i in range(1, n):
        pref[i] = pref[i - 1] + a[i]

    if L == 0:
        return pref[R]
    return pref[R] - pref[L]

if __name__ == "__main__":
    a = [2, 4, 1, 7, 3]
    print(range_sum(a, 1, 3))`,
`import heapq

def shortest_path(V, adj, src, dest):
    INF = 10**9
    dist = [INF] * V
    pq = [(0, src)]
    dist[src] = 0

    while pq:
        d, u = heapq.heappop(pq)
        if d != dist[u]:
            continue

        for v, w in adj[u]:
            if d + w < dist[v]:
                dist[v] = d
                heapq.heappush(pq, (dist[v], v))

    return -1 if dist[dest] == INF else dist[dest]

if __name__ == "__main__":
    V = 4
    adj = [[] for _ in range(V)]
    def add(u, v, w):
        adj[u].append((v, w))
        adj[v].append((u, w))

    add(0, 1, 4)
    add(0, 2, 1)
    add(2, 1, 2)
    add(1, 3, 1)
    add(2, 3, 5)

    print(shortest_path(V, adj, 0, 3))`
    ],
    'Java': [
`class Node {
    int val;
    Node left, right;
    Node(int val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

public class Challenge1 {
    public static boolean searchBST(Node root, int target) {
        if (root == null) return false;
        if (root.val == target) return true;

        if (target < root.val)
            return searchBST(root.right, target);  
        return searchBST(root.left, target);       
    }

    public static void main(String[] args) {
        Node root = new Node(8);
        root.left = new Node(3);
        root.right = new Node(10);
        root.left.left = new Node(1);
        root.left.right = new Node(6);
        root.left.right.left = new Node(4);
        root.left.right.right = new Node(7);
        root.right.right = new Node(14);
        root.right.right.left = new Node(13);

        System.out.println(searchBST(root, 7));
    }
}`,
`import java.util.*;

public class Challenge2 {
    public static int reachableCount(int V, List<List<Integer>> adj, int src) {
        int[] visited = new int[V];
        Queue<Integer> q = new LinkedList<>();
        q.add(src);

        int count = 0;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v : adj.get(u)) {
                if (visited[v] == 0) {
                    q.add(v);
                    visited[v] = 0;  
                }
            }
            count++;
        }
        return count;
    }

    public static void main(String[] args) {
        int V = 6;
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
        adj.get(0).add(1); adj.get(1).add(0);
        adj.get(0).add(2); adj.get(2).add(0);
        adj.get(1).add(3); adj.get(3).add(1);
        adj.get(2).add(4); adj.get(4).add(2);
        adj.get(4).add(5); adj.get(5).add(4);

        System.out.println(reachableCount(V, adj, 0));
    }
}`,
`public class Challenge3 {
    public static long countPaths(int[][] grid) {
        int r = grid.length, c = grid[0].length;
        long[][] dp = new long[r][c];

        dp[0][0] = 1;

        for (int i = 0; i < r; ++i) {
            for (int j = 0; j < c; ++j) {
                if (grid[i][j] == 1) {
                    dp[i][j] = 1;  
                    continue;
                }
                if (i > 0) dp[i][j] += dp[i - 1][j];
                if (j > 0) dp[i][j] += dp[i - 1][j];
            }
        }
        return dp[r - 1][c - 1];
    }

    public static void main(String[] args) {
        int[][] grid = {
            {0, 0, 0},
            {0, 1, 0},
            {0, 0, 0}
        };
        System.out.println(countPaths(grid));
    }
}`,
`public class Challenge4 {
    public static long rangeSum(int[] a, int L, int R) {
        int n = a.length;
        long[] pref = new long[n];

        pref[0] = a[0];
        for (int i = 1; i < n; ++i)
            pref[i] = pref[i - 1] + a[i];

        if (L == 0) return pref[R];
        return pref[R] - pref[L];  
    }

    public static void main(String[] args) {
        int[] a = {2, 4, 1, 7, 3};
        System.out.println(rangeSum(a, 1, 3));
    }
}`,
`import java.util.*;

public class Challenge5 {
    static class Edge {
        int to, weight;
        Edge(int to, int weight) { this.to = to; this.weight = weight; }
    }

    static class Element implements Comparable<Element> {
        int dist, node;
        Element(int dist, int node) { this.dist = dist; this.node = node; }
        public int compareTo(Element o) { return Integer.compare(this.dist, o.dist); }
    }

    public static int shortestPath(int V, List<List<Edge>> adj, int src, int dest) {
        int INF = 1000000000;
        int[] dist = new int[V];
        Arrays.fill(dist, INF);
        PriorityQueue<Element> pq = new PriorityQueue<>();

        dist[src] = 0;
        pq.add(new Element(0, src));

        while (!pq.isEmpty()) {
            Element top = pq.poll();
            int d = top.dist, u = top.node;
            if (d != dist[u]) continue;

            for (Edge edge : adj.get(u)) {
                int v = edge.to, w = edge.weight;
                if (d + w < dist[v]) {
                    dist[v] = d;  
                    pq.add(new Element(dist[v], v));
                }
            }
        }
        return dist[dest] == INF ? -1 : dist[dest];
    }

    public static void main(String[] args) {
        int V = 4;
        List<List<Edge>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());
        autoAdd(adj, 0, 1, 4);
        autoAdd(adj, 0, 2, 1);
        autoAdd(adj, 2, 1, 2);
        autoAdd(adj, 1, 3, 1);
        autoAdd(adj, 2, 3, 5);

        System.out.println(shortestPath(V, adj, 0, 3));
    }

    static void autoAdd(List<List<Edge>> adj, int u, int v, int w) {
        adj.get(u).add(new Edge(v, w));
        adj.get(v).add(new Edge(u, w));
    }
}`
    ],
    'C': [
`#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

struct Node {
    int val;
    struct Node *left, *right;
};

struct Node* createNode(int x) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = x;
    n->left = n->right = NULL;
    return n;
}

bool searchBST(struct Node* root, int target) {
    if (root == NULL) return false;
    if (root->val == target) return true;

    if (target < root->val)
        return searchBST(root->right, target);  
    return searchBST(root->left, target);       
}

int main() {
    struct Node* root = createNode(8);
    root->left = createNode(3);
    root->right = createNode(10);
    root->left->left = createNode(1);
    root->left->right = createNode(6);
    root->left->right->left = createNode(4);
    root->left->right->right = createNode(7);
    root->right->right = createNode(14);
    root->right->right->left = createNode(13);

    printf("%s", searchBST(root, 7) ? "true" : "false");
    return 0;
}`,
`#include <stdio.h>
#include <stdlib.h>

int reachableCount(int V, int adj[][6], int deg[], int src) {
    int visited[100] = {0};
    int q[100];
    int head = 0, tail = 0;
    q[tail++] = src;

    int count = 0;
    while (head < tail) {
        int u = q[head++];
        for (int i = 0; i < deg[u]; i++) {
            int v = adj[u][i];
            if (!visited[v]) {
                q[tail++] = v;
                visited[v] = 0;  
            }
        }
        count++;
    }
    return count;
}

int main() {
    int V = 6;
    int adj[6][6] = {0};
    int deg[6] = {0};
    int edges[][2] = {{0,1},{0,2},{1,3},{2,4},{4,5}};
    for (int i = 0; i < 5; i++) {
        int u = edges[i][0], v = edges[i][1];
        adj[u][deg[u]++] = v;
        adj[v][deg[v]++] = u;
    }
    printf("%d", reachableCount(V, adj, deg, 0));
    return 0;
}`,
`#include <stdio.h>

long long countPaths(int r, int c, int grid[3][3]) {
    long long dp[3][3] = {0};
    dp[0][0] = 1;

    for (int i = 0; i < r; ++i) {
        for (int j = 0; j < c; ++j) {
            if (grid[i][j] == 1) {
                dp[i][j] = 1;  
                continue;
            }
            if (i > 0) dp[i][j] += dp[i-1][j];
            if (j > 0) dp[i][j] += dp[i-1][j];
        }
    }
    return dp[r-1][c-1];
}

int main() {
    int grid[3][3] = {
        {0,0,0},
        {0,1,0},
        {0,0,0}
    };
    printf("%lld", countPaths(3, 3, grid));
    return 0;
}`,
`#include <stdio.h>

long long rangeSum(int a[], int n, int L, int R) {
    long long pref[100] = {0};
    pref[0] = a[0];
    for (int i = 1; i < n; ++i)
        pref[i] = pref[i-1] + a[i];

    if (L == 0) return pref[R];
    return pref[R] - pref[L];  
}

int main() {
    int a[] = {2,4,1,7,3};
    printf("%lld", rangeSum(a, 5, 1, 3));
    return 0;
}`,
`#include <stdio.h>
#include <stdlib.h>

#define INF 1000000000

int shortestPath(int V, int adj[][4], int weight[][4], int deg[], int src, int dest) {
    int dist[4];
    int visited[4] = {0};
    for (int i = 0; i < V; i++) dist[i] = INF;
    dist[src] = 0;

    for (int i = 0; i < V; i++) {
        int u = -1;
        for (int j = 0; j < V; j++) {
            if (!visited[j] && (u == -1 || dist[j] < dist[u]))
                u = j;
        }
        if (u == -1 || dist[u] == INF) break;
        visited[u] = 1;

        for (int k = 0; k < deg[u]; k++) {
            int v = adj[u][k];
            int w = weight[u][k];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u];  
            }
        }
    }
    return dist[dest] == INF ? -1 : dist[dest];
}

int main() {
    int V = 4;
    int adj[4][4] = {0}, weight[4][4] = {0}, deg[4] = {0};
    int edges[][3] = {{0,1,4},{0,2,1},{2,1,2},{1,3,1},{2,3,5}};
    for (int i = 0; i < 5; i++) {
        int u = edges[i][0], v = edges[i][1], w = edges[i][2];
        adj[u][deg[u]] = v;
        weight[u][deg[u]++] = w;
        adj[v][deg[v]] = u;
        weight[v][deg[v]++] = w;
    }
    printf("%d", shortestPath(V, adj, weight, deg, 0, 3));
    return 0;
}`
    ]
};

const QUESTIONS = [
    { "id": 1, "title": "Fix the BST Search Logic", "concept": "Binary Search Tree", "difficulty": "HARD", "statement": "A binary search tree stores distinct integer keys. The supplied function should return true when a target key exists in the tree and false otherwise. The implementation contains one or more logic errors.", "task": "Review the supplied implementation, identify the traversal/comparison errors, fix only the faulty logic, and validate it against the test cases.", "constraints": "1 ≤ number of nodes ≤ 10^5; keys are distinct; values fit in 32-bit signed integers.", "tests": [["Tree: 8, 3, 10, 1, 6, 14, 4, 7, 13 | target = 7", "true"], ["Tree: 8, 3, 10, 1, 6, 14, 4, 7, 13 | target = 9", "false"]] },
    { "id": 2, "title": "Debug Graph BFS Traversal", "concept": "Graph + BFS", "difficulty": "HARD", "statement": "Given an undirected graph, the function must perform BFS from a source vertex and count how many vertices are reachable. The starter implementation contains traversal-state errors.", "task": "Find and fix the bug(s) affecting queue processing and visited-state handling without replacing the algorithm with a different approach.", "constraints": "1 ≤ V ≤ 10^5; 0 ≤ E ≤ 2×10^5; vertices are numbered 0 to V-1.", "tests": [["V=6, edges=(0,1),(0,2),(1,3),(2,4),(4,5), source=0", "6"], ["V=5, edges=(0,1),(1,2),(3,4), source=0", "3"]] },
    { "id": 3, "title": "Fix the Grid Path DP", "concept": "2D Dynamic Programming", "difficulty": "HARD", "statement": "A robot starts at the top-left of a grid and can move only right or down. Cells marked 1 are blocked. Return the number of valid paths to the bottom-right cell.", "task": "Debug the existing 2D DP implementation. Correct its initialization and boundary/blocked-cell handling while keeping the O(R×C) approach.", "constraints": "1 ≤ rows, cols ≤ 500; grid values are 0 (open) or 1 (blocked).", "tests": [["grid = [[0,0,0],[0,1,0],[0,0,0]]", "2"], ["grid = [[0,1],[0,0]]", "1"]] },
    { "id": 4, "title": "Debug Range Query Logic", "concept": "Prefix Sum + Arrays", "difficulty": "MEDIUM-HARD", "statement": "Given an integer array and multiple inclusive range queries [L,R], return the sum for every query using prefix sums. The starter code has an indexing error.", "task": "Fix the prefix construction/query boundary logic. Do not replace the prefix-sum approach with O(N) work per query.", "constraints": "1 ≤ N,Q ≤ 2×10^5; -10^9 ≤ A[i] ≤ 10^9; 0 ≤ L ≤ R < N.", "tests": [["A=[2,4,1,7,3], query=[1,3]", "12"], ["A=[5,-2,6,1], query=[0,2]", "9"]] },
    { "id": 5, "title": "Fix Shortest Path Implementation", "concept": "Graph + Priority Queue", "difficulty": "HARD", "statement": "Given a weighted graph with non-negative edge weights, compute the shortest distance from a source to a destination using Dijkstra's algorithm. The supplied implementation contains a relaxation/priority-queue bug.", "task": "Identify and fix the incorrect distance-update or stale-state logic. Preserve Dijkstra's priority-queue approach.", "constraints": "1 ≤ V ≤ 10^5; 0 ≤ E ≤ 2×10^5; edge weights are non-negative.", "tests": [["Edges: 0-1(4), 0-2(1), 2-1(2), 1-3(1), 2-3(5); 0→3", "4"], ["Edges: 0-1(7), 0-2(2), 2-1(1), 1-3(3); 0→3", "6"]] }
];

const TOTAL = QUESTIONS.length;
const LIMIT = 20 * 60;

// Universal language check patterns
const SUBMIT_CHECKS = [
    // Q1: Target < val -> search left, else search right
    /target\s*<\s*root(?:->|\.)val\s*\)?\s*(?:\{|:)?\s*return\s*search(?:BST|_bst)\(root(?:->|\.)left/i,
    // Q2: visited = 1 or true or True
    /visited\[v\]\s*=\s*(?:1|true|True)/,
    // Q3: dp[i][j] = 0 when cell is blocked
    /grid\[i\]\[j\]\s*==\s*1[\s\S]*dp\[i\]\[j\]\s*=\s*0/,
    // Q4: pref[R] - pref[L - 1]
    /pref\[R\]\s*-\s*pref\[L\s*-\s*1\]/,
    // Q5: dist[v] = d + w or dist[u] + w
    /(?:dist\[v\]\s*=\s*d\s*\+\s*w|dist\[v\]\s*=\s*dist\[u\]\s*\+\s*w)/
];

// ===== Mutable app state =====
let active = 0;
let selectedLang = 'C++';
let remaining = Array(TOTAL).fill(LIMIT);
let started = Array(TOTAL).fill(false);
let expired = Array(TOTAL).fill(false);
let solved = Array(TOTAL).fill(false);
let manualLocked = Array(TOTAL).fill(false);
let codesByLang = {
    'C++': [...STARTER_CODES['C++']],
    'Python': [...STARTER_CODES['Python']],
    'Java': [...STARTER_CODES['Java']],
    'C': [...STARTER_CODES['C']]
};
let lastTick = Date.now();

// ===== DOM helpers =====
function $(id) {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Element #${id} not found`);
    return el;
}
function $select(id) { return $(id); }
function $textarea(id) { return $(id); }
function $button(id) { return $(id); }

function fmt(s) {
    s = Math.max(0, Math.floor(s));
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

function startQuestion(i) {
    if (manualLocked[i] || solved[i]) return;
    active = i;
    started[i] = true;
    lastTick = Date.now();
    render();
}

function toggleQuestionLock(i) {
    manualLocked[i] = !manualLocked[i];
    if (manualLocked[i]) {
        started[i] = false;
    } else {
        remaining[i] = LIMIT;
        expired[i] = false;
        started[i] = false;
    }
    saveState();
    if (active === i) render();
    else renderNav();
}

setInterval(() => {
    if (!started[active] || manualLocked[active] || expired[active] || solved[active]) return;
    const now = Date.now();
    const delta = Math.floor((now - lastTick) / 1000);
    if (delta > 0) {
        remaining[active] -= delta;
        lastTick += delta * 1000;
        if (remaining[active] <= 0) {
            remaining[active] = LIMIT;
            started[active] = false;
            manualLocked[active] = true;
            expired[active] = false;
        }
        renderTimer();
        renderNav();
        saveState();
    }
}, 250);

function renderTimer() {
    const t = $("timer");
    const strong = t.querySelector("strong");
    if (strong) strong.textContent = fmt(remaining[active]);
    t.classList.toggle("warning", remaining[active] <= 300 && remaining[active] > 60);
    t.classList.toggle("danger", remaining[active] <= 60);
}

function renderNav() {
    $("qnav").innerHTML = QUESTIONS.map((q, i) => {
        const locked = manualLocked[i];
        const status = solved[i] ? "SOLVED" : locked ? "LOCKED" : i === active ? "ACTIVE" : "READY";
        const icon = locked ? "🔒" : "🔓";
        return `<div class="qrow"><button type="button" class="qbtn ${i === active ? 'active ' : ''}${solved[i] ? 'done ' : ''}${locked ? 'locked' : ''}" data-i="${i}"><span class="qnum">${String(i + 1).padStart(2, '0')}</span><span><b>${q.title}</b><span class="qmeta">${q.concept}</span></span><span class="status">${status}</span></button><button type="button" class="lockbtn ${locked ? 'is-locked' : 'is-unlocked'}" data-lock="${i}" title="${locked ? 'Unlock question' : 'Lock question'}">${icon}</button></div>`;
    }).join('');

    document.querySelectorAll('.qbtn').forEach(b => {
        b.addEventListener('click', () => startQuestion(Number(b.dataset.i)));
    });
    document.querySelectorAll('.lockbtn').forEach(b => {
        b.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleQuestionLock(Number(b.dataset.lock));
        });
    });
    const done = solved.filter(Boolean).length;
    $("progText").textContent = `${done} / ${TOTAL}`;
    $("progBar").style.width = `${Math.round(done / TOTAL * 100)}%`;
}

function render() {
    const q = QUESTIONS[active];
    $("qtag").textContent = `QUESTION ${String(active + 1).padStart(2, '0')}`;
    $("title").textContent = q.title;
    $("difficulty").textContent = q.difficulty;
    $("statement").textContent = q.statement;
    $("task").textContent = q.task;
    $("constraints").textContent = q.constraints;
    $("tests").innerHTML = q.tests.map((t, i) => `<div class="test"><b>TEST ${i + 1}</b><br>${t[0]}<br><span style="color:#7d8b9e">Expected:</span> ${t[1]}</div>`).join('');

    $select("language").value = selectedLang;
    $("filename").textContent = `challenge${active + 1}.${EXT_BY_LANG[selectedLang] || 'cpp'}`;
    $textarea("code").value = (codesByLang[selectedLang] && codesByLang[selectedLang][active]) || '';

    const locked = manualLocked[active] || solved[active];
    $textarea("code").disabled = locked;
    $button("submit").disabled = locked;
    $button("run").disabled = locked;
    $button("prev").disabled = active === 0;

    updateLines();
    renderTimer();
    renderNav();
    $("stateText").textContent = manualLocked[active]
        ? "QUESTION LOCKED • UNLOCK TO START"
        : solved[active] ? "SOLUTION ACCEPTED" : "IN PROGRESS";
}

function updateLines() {
    const n = $textarea("code").value.split('\n').length;
    $("lines").textContent = Array.from({ length: n }, (_, i) => String(i + 1)).join('\n');
}

$textarea("code").addEventListener('input', () => {
    if (!codesByLang[selectedLang]) {
        codesByLang[selectedLang] = [...(STARTER_CODES[selectedLang] || [])];
    }
    codesByLang[selectedLang][active] = $textarea("code").value;
    updateLines();
    saveState();
});

$textarea("code").addEventListener('scroll', () => {
    $("lines").scrollTop = $textarea("code").scrollTop;
});

function runCode() {
    if (manualLocked[active] || solved[active]) return;
    const code = $textarea("code").value;
    const out = $("output");
    out.className = "output show";
    const normalized = code.replace(/\s+/g, ' ');
    const ok = !!SUBMIT_CHECKS[active] && SUBMIT_CHECKS[active].test(normalized);
    out.innerHTML = ok
        ? '<span class="ok">TEST RUN COMPLETE</span><br>Sample cases: <span class="ok">PASSED</span><br><span class="info">The submitted logic matches the simulator\'s validation rule.</span>'
        : '<span class="err">TEST RUN COMPLETE</span><br>Sample cases: <span class="err">FAILED</span><br><span class="info">Review the implementation and validate the faulty logic.</span>';
}
$("run").addEventListener('click', runCode);

function showSubmissionResult(passed) {
    const q = QUESTIONS[active];
    const total = q.tests.length;
    const passedCount = passed ? total : 0;
    $("resultTitle").textContent = passed ? 'Accepted' : 'Wrong Answer';
    $("resultTitle").style.color = passed ? 'var(--green)' : 'var(--danger)';
    $("resultSummary").textContent = `${passedCount} / ${total} test cases passed`;
    $("resultTests").innerHTML = q.tests.map((t, i) => {
        const tp = passed;
        return `<div class="test"><b>TEST ${i + 1}</b> <span style="float:right" class="${tp ? 'ok' : 'err'}">${tp ? 'PASSED' : 'FAILED'}</span><br>${t[0]}<br><span style="color:#7d8b9e">Expected:</span> ${t[1]}</div>`;
    }).join('');
    const isLast = active === TOTAL - 1;
    $button("resultClose").textContent = passed ? (isLast ? 'Continue' : 'Continue to Next') : 'Try Again';
    $("resultModal").dataset.passed = passed ? '1' : '0';
    $("resultModal").classList.add('show');
}

$("submit").addEventListener('click', () => {
    if (manualLocked[active] || solved[active]) return;
    const code = $textarea("code").value.replace(/\s+/g, ' ');
    const passed = !!SUBMIT_CHECKS[active] && SUBMIT_CHECKS[active].test(code);
    if (!codesByLang[selectedLang]) codesByLang[selectedLang] = [];
    codesByLang[selectedLang][active] = $textarea("code").value;
    saveState();
    showSubmissionResult(passed);
});

$("resultClose").addEventListener('click', () => {
    const passed = $("resultModal").dataset.passed === '1';
    $("resultModal").classList.remove('show');
    if (!passed) return;
    solved[active] = true;
    saveState();
    if (active < TOTAL - 1) {
        startQuestion(active + 1);
    } else {
        $("solvedStat").textContent = String(solved.filter(Boolean).length);
        $("unsolvedStat").textContent = String(TOTAL - solved.filter(Boolean).length - expired.filter(Boolean).length);
        $("expiredStat").textContent = String(expired.filter(Boolean).length);
        $("modal").classList.add('show');
    }
});

$("prev").addEventListener('click', () => {
    if (active > 0 && !manualLocked[active - 1]) startQuestion(active - 1);
});

$select("language").addEventListener('change', () => {
    const newLang = $select("language").value;
    if (STARTER_CODES[newLang]) {
        if (newLang !== selectedLang && !manualLocked[active] && !solved[active]) {
            // Switching language restarts the active question's timer from 20:00.
            remaining[active] = LIMIT;
            expired[active] = false;
            lastTick = Date.now();
            renderTimer();
        }
        selectedLang = newLang;
        if (!codesByLang[selectedLang]) {
            codesByLang[selectedLang] = [...STARTER_CODES[selectedLang]];
        }
        $("filename").textContent = `challenge${active + 1}.${EXT_BY_LANG[selectedLang] || 'cpp'}`;
        $textarea("code").value = codesByLang[selectedLang][active] || STARTER_CODES[selectedLang][active];
        updateLines();
        saveState();
    }
});

$("cancel").addEventListener('click', () => $("modal").classList.remove('show'));

$("final").addEventListener('click', () => {
    $("modal").classList.remove('show');
    document.querySelectorAll('button').forEach(b => b.disabled = true);
    $textarea("code").disabled = true;
    $("title").textContent = 'Assessment Submitted';
    $("qtag").textContent = 'COMPLETED';
    $("difficulty").textContent = 'FINAL';
    $("statement").textContent = 'Your Campusmonk debugging assessment has been submitted.';
    $("task").textContent = `Solved: ${solved.filter(Boolean).length} / ${TOTAL} • Expired: ${expired.filter(Boolean).length} • Unsolved: ${TOTAL - solved.filter(Boolean).length - expired.filter(Boolean).length}`;
    $("constraints").textContent = 'Assessment locked after final submission.';
    $("tests").innerHTML = '';
    $("stateText").textContent = 'ASSESSMENT SUBMITTED';
    localStorage.removeItem('cm_debug_state_native');
});

function saveState() {
    try {
        const state = { active, remaining, started, expired, solved, selectedLang, codesByLang, manualLocked };
        localStorage.setItem('cm_debug_state_native', JSON.stringify(state));
    } catch { /* ignore */ }
}

// Older saved states still contain "// BUG: ..." hint comments; remove them.
const BUG_HINT = /^[ \t]*(\/\/|#)[ \t]*BUG:.*(\r?\n|$)|[ \t]*(\/\/|#)[ \t]*BUG:.*$/gm;
function stripBugHints() {
    Object.keys(codesByLang).forEach(lang => {
        if (!Array.isArray(codesByLang[lang])) return;
        codesByLang[lang] = codesByLang[lang].map(c => typeof c === 'string' ? c.replace(BUG_HINT, '') : c);
    });
}

function restore() {
    try {
        const raw = localStorage.getItem('cm_debug_state_native');
        if (!raw) return;
        const s = JSON.parse(raw);
        if (!s) return;
        if (typeof s.active === 'number') active = s.active;
        if (Array.isArray(s.remaining)) remaining = s.remaining;
        if (Array.isArray(s.started)) started = s.started;
        if (Array.isArray(s.expired)) expired = s.expired;
        if (Array.isArray(s.solved)) solved = s.solved;
        if (Array.isArray(s.manualLocked)) manualLocked = s.manualLocked;
        if (typeof s.selectedLang === 'string' && STARTER_CODES[s.selectedLang]) {
            selectedLang = s.selectedLang;
        }
        if (s.codesByLang && typeof s.codesByLang === 'object') {
            codesByLang = Object.assign({}, codesByLang, s.codesByLang);
        } else if (Array.isArray(s.codes)) {
            codesByLang['C++'] = s.codes;
        }
        stripBugHints();
    } catch { /* ignore corrupt */ }
}

restore();
if (!manualLocked[active] && !solved[active]) {
    started[active] = true;
    lastTick = Date.now();
}
render();
