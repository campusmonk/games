"use strict";
// ===== Data =====
const EXT_BY_LANG = { 'C': 'c', 'C++': 'cpp', 'Java': 'java', 'Python': 'py' };

const STARTER_CODES = {
    'C++': [
`#include <bits/stdc++.h>
using namespace std;

struct Node {
    int val;
    Node *next;
    Node(int x) : val(x), next(nullptr) {}
};

Node* reverseList(Node* head) {
    Node* prev = nullptr;
    Node* curr = head;

    while (curr != nullptr) {
        curr->next = prev;
        prev = curr;
        curr = curr->next;
    }
    return prev;
}

void printList(Node* head) {
    while (head) { cout << head->val << (head->next ? " " : ""); head = head->next; }
}

int main() {
    Node* head = new Node(1);
    head->next = new Node(2);
    head->next->next = new Node(3);
    head->next->next->next = new Node(4);
    head->next->next->next->next = new Node(5);

    Node* reversed = reverseList(head);
    printList(reversed);
}`,
`#include <bits/stdc++.h>
using namespace std;

bool isBalanced(string s) {
    stack<char> st;

    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top();
            st.pop();
            if (c == ')' && top != '(') return false;
            if (c == ']' && top != '[') return false;
            if (c == '}' && top != '{') return false;
        }
    }

    return true;
}

int main() {
    cout << boolalpha << isBalanced("{[()]}");
}`,
`#include <bits/stdc++.h>
using namespace std;

int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0];
    int curSum = nums[0];

    for (int i = 1; i < (int)nums.size(); ++i) {
        curSum = max(nums[i], curSum);    
        maxSum = max(maxSum, curSum);
    }
    return maxSum;
}

int main() {
    vector<int> nums = {-2,1,-3,4,-1,2,1,-5,4};
    cout << maxSubArray(nums);
}`,
`#include <bits/stdc++.h>
using namespace std;

int mergeIntervals(vector<vector<int>> intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged;

    for (auto& iv : intervals) {
        if (!merged.empty() && iv[0] <= merged.back()[1]) {
            merged.back()[1] = iv[1];
        } else {
            merged.push_back(iv);
        }
    }
    return (int)merged.size();
}

int main() {
    vector<vector<int>> intervals = {{1,3},{2,6},{8,10},{15,18}};
    cout << mergeIntervals(intervals);
}`,
`#include <bits/stdc++.h>
using namespace std;

int search(vector<int>& nums, int target) {
    int lo = 0, hi = (int)nums.size() - 1;

    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (nums[mid] == target) return mid;

        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid])
                lo = mid + 1;
            else
                lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi])
                lo = mid + 1;
            else
                hi = mid - 1;
        }
    }
    return -1;
}

int main() {
    vector<int> nums = {4,5,6,7,0,1,2};
    cout << search(nums, 0);
}`
    ],
    'Python': [
`class Node:
    def __init__(self, val):
        self.val = val
        self.next = None

def reverse_list(head):
    prev = None
    curr = head

    while curr is not None:
        curr.next = prev
        prev = curr
        curr = curr.next

    return prev

def print_list(head):
    vals = []
    while head:
        vals.append(str(head.val))
        head = head.next
    print(" ".join(vals))

if __name__ == "__main__":
    head = Node(1)
    head.next = Node(2)
    head.next.next = Node(3)
    head.next.next.next = Node(4)
    head.next.next.next.next = Node(5)

    print_list(reverse_list(head))`,
`def is_balanced(s):
    st = []

    for c in s:
        if c in "([{":
            st.append(c)
        else:
            if not st:
                return False
            top = st.pop()
            if c == ')' and top != '(':
                return False
            if c == ']' and top != '[':
                return False
            if c == '}' and top != '{':
                return False

    return True

if __name__ == "__main__":
    print(str(is_balanced("{[()]}")).lower())`,
`def max_sub_array(nums):
    max_sum = nums[0]
    cur_sum = nums[0]

    for i in range(1, len(nums)):
        cur_sum = max(nums[i], cur_sum)
        max_sum = max(max_sum, cur_sum)

    return max_sum

if __name__ == "__main__":
    nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
    print(max_sub_array(nums))`,
`def merge_intervals(intervals):
    intervals.sort()
    merged = []

    for iv in intervals:
        if merged and iv[0] <= merged[-1][1]:
            merged[-1][1] = iv[1]
        else:
            merged.append(iv)

    return len(merged)

if __name__ == "__main__":
    intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]
    print(merge_intervals(intervals))`,
`def search(nums, target):
    lo, hi = 0, len(nums) - 1

    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid

        if nums[lo] <= nums[mid]:
            if nums[lo] <= target and target < nums[mid]:
                lo = mid + 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target and target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1

    return -1

if __name__ == "__main__":
    nums = [4, 5, 6, 7, 0, 1, 2]
    print(search(nums, 0))`
    ],
    'Java': [
`class Node {
    int val;
    Node next;
    Node(int x) { val = x; next = null; }
}

public class Challenge1 {
    public static Node reverseList(Node head) {
        Node prev = null;
        Node curr = head;

        while (curr != null) {
            curr.next = prev;
            prev = curr;
            curr = curr.next;
        }
        return prev;
    }

    public static void main(String[] args) {
        Node head = new Node(1);
        head.next = new Node(2);
        head.next.next = new Node(3);
        head.next.next.next = new Node(4);
        head.next.next.next.next = new Node(5);

        Node reversed = reverseList(head);
        while (reversed != null) {
            System.out.print(reversed.val + (reversed.next != null ? " " : ""));
            reversed = reversed.next;
        }
    }
}`,
`import java.util.Stack;

public class Challenge2 {
    public static boolean isBalanced(String s) {
        Stack<Character> st = new Stack<>();

        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else {
                if (st.isEmpty()) return false;
                char top = st.pop();
                if (c == ')' && top != '(') return false;
                if (c == ']' && top != '[') return false;
                if (c == '}' && top != '{') return false;
            }
        }

        return true;
    }

    public static void main(String[] args) {
        System.out.println(isBalanced("{[()]}"));
    }
}`,
`public class Challenge3 {
    public static int maxSubArray(int[] nums) {
        int maxSum = nums[0];
        int curSum = nums[0];

        for (int i = 1; i < nums.length; ++i) {
            curSum = Math.max(nums[i], curSum);
            maxSum = Math.max(maxSum, curSum);
        }
        return maxSum;
    }

    public static void main(String[] args) {
        int[] nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        System.out.println(maxSubArray(nums));
    }
}`,
`import java.util.*;

public class Challenge4 {
    public static int mergeIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> merged = new ArrayList<>();

        for (int[] iv : intervals) {
            if (!merged.isEmpty() && iv[0] <= merged.get(merged.size() - 1)[1]) {
                merged.get(merged.size() - 1)[1] = iv[1];
            } else {
                merged.add(iv);
            }
        }
        return merged.size();
    }

    public static void main(String[] args) {
        int[][] intervals = {{1, 3}, {2, 6}, {8, 10}, {15, 18}};
        System.out.println(mergeIntervals(intervals));
    }
}`,
`public class Challenge5 {
    public static int search(int[] nums, int target) {
        int lo = 0, hi = nums.length - 1;

        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            if (nums[mid] == target) return mid;

            if (nums[lo] <= nums[mid]) {
                if (nums[lo] <= target && target < nums[mid])
                    lo = mid + 1;
                else
                    lo = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[hi])
                    lo = mid + 1;
                else
                    hi = mid - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] nums = {4, 5, 6, 7, 0, 1, 2};
        System.out.println(search(nums, 0));
    }
}`
    ],
    'C': [
`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int val;
    struct Node *next;
};

struct Node* createNode(int x) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = x;
    n->next = NULL;
    return n;
}

struct Node* reverseList(struct Node* head) {
    struct Node* prev = NULL;
    struct Node* curr = head;

    while (curr != NULL) {
        curr->next = prev;
        prev = curr;
        curr = curr->next;
    }
    return prev;
}

int main() {
    struct Node* head = createNode(1);
    head->next = createNode(2);
    head->next->next = createNode(3);
    head->next->next->next = createNode(4);
    head->next->next->next->next = createNode(5);

    struct Node* reversed = reverseList(head);
    while (reversed) {
        printf("%d%s", reversed->val, reversed->next ? " " : "");
        reversed = reversed->next;
    }
    return 0;
}`,
`#include <stdio.h>
#include <stdbool.h>
#include <string.h>

bool isBalanced(const char* s) {
    char st[1000];
    int top = 0;

    for (int i = 0; s[i]; i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') {
            st[top++] = c;
        } else {
            if (top == 0) return false;
            char t = st[--top];
            if (c == ')' && t != '(') return false;
            if (c == ']' && t != '[') return false;
            if (c == '}' && t != '{') return false;
        }
    }

    return true;
}

int main() {
    printf("%s", isBalanced("{[()]}") ? "true" : "false");
    return 0;
}`,
`#include <stdio.h>

int max(int a, int b) { return a > b ? a : b; }

int maxSubArray(int nums[], int n) {
    int maxSum = nums[0];
    int curSum = nums[0];

    for (int i = 1; i < n; ++i) {
        curSum = max(nums[i], curSum);
        maxSum = max(maxSum, curSum);
    }
    return maxSum;
}

int main() {
    int nums[] = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    printf("%d", maxSubArray(nums, 9));
    return 0;
}`,
`#include <stdio.h>
#include <stdlib.h>

int max(int a, int b) { return a > b ? a : b; }

int mergeIntervals(int intervals[][2], int n) {
    int merged[100][2];
    int count = 0;

    for (int i = 0; i < n; i++) {
        if (count > 0 && intervals[i][0] <= merged[count - 1][1]) {
            merged[count - 1][1] = intervals[i][1];
        } else {
            merged[count][0] = intervals[i][0];
            merged[count++][1] = intervals[i][1];
        }
    }
    return count;
}

int main() {
    int intervals[][2] = {{1, 3}, {2, 6}, {8, 10}, {15, 18}};
    printf("%d", mergeIntervals(intervals, 4));
    return 0;
}`,
`#include <stdio.h>

int search(int nums[], int n, int target) {
    int lo = 0, hi = n - 1;

    while (lo <= hi) {
        int mid = (lo + hi) / 2;
        if (nums[mid] == target) return mid;

        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid])
                lo = mid + 1;
            else
                lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi])
                lo = mid + 1;
            else
                hi = mid - 1;
        }
    }
    return -1;
}

int main() {
    int nums[] = {4, 5, 6, 7, 0, 1, 2};
    printf("%d", search(nums, 7, 0));
    return 0;
}`
    ]
};

const QUESTIONS = [
    { "id": 1, "title": "Fix the Linked List Reversal", "concept": "Linked List", "difficulty": "HARD", "statement": "Given the head of a singly linked list, the function should reverse the list in place and return the new head. The supplied implementation loses the rest of the list because pointers are reassigned in the wrong order.", "task": "Review the supplied implementation, identify the pointer-reassignment error, fix only the faulty logic, and validate it against the test cases.", "constraints": "0 ≤ number of nodes ≤ 10^5; node values fit in 32-bit signed integers.", "tests": [["List: 1 -> 2 -> 3 -> 4 -> 5", "5 4 3 2 1"], ["List: 10 -> 20", "20 10"]] },
    { "id": 2, "title": "Debug the Balanced Parentheses Checker", "concept": "Stack", "difficulty": "MEDIUM-HARD", "statement": "Given a string containing only the characters ( ) [ ] { }, determine whether the brackets are balanced using a stack. The starter implementation always reports the string as balanced, even when brackets are left unmatched.", "task": "Find and fix the bug in the final validation step so the function correctly rejects strings with unmatched opening brackets.", "constraints": "0 ≤ string length ≤ 10^5; the string contains only the characters ( ) [ ] { }.", "tests": [["s = {[()]}", "true"], ["s = (()", "false"], ["s = ]", "false"]] },
    { "id": 3, "title": "Fix Kadane's Maximum Subarray Sum", "concept": "Dynamic Programming (Kadane's Algorithm)", "difficulty": "HARD", "statement": "Given an integer array, return the sum of the contiguous subarray with the largest sum. The supplied implementation never extends the running sum with the current element, so it produces an incorrect maximum whenever extending the subarray would help.", "task": "Review the running-sum update inside the loop, fix the faulty logic, and validate it against the test cases.", "constraints": "1 ≤ array length ≤ 10^5; -10^4 ≤ A[i] ≤ 10^4.", "tests": [["A=[-2,1,-3,4,-1,2,1,-5,4]", "6"], ["A=[5,4,-1,7,8]", "23"]] },
    { "id": 4, "title": "Debug Merge Overlapping Intervals", "concept": "Arrays / Intervals", "difficulty": "HARD", "statement": "Given a list of intervals, merge all overlapping intervals and return how many intervals remain after merging. The starter implementation overwrites the end of the merged interval instead of extending it, so a shorter interval nested inside a longer one incorrectly shrinks the merged range.", "task": "Fix the merge step so the merged interval's end is always the maximum of the overlapping ends, then validate against the test cases.", "constraints": "1 ≤ number of intervals ≤ 10^5; 0 ≤ start ≤ end ≤ 10^9.", "tests": [["intervals = [[1,3],[2,6],[8,10],[15,18]]", "3"], ["intervals = [[1,10],[2,3],[4,5]]", "1"]] },
    { "id": 5, "title": "Fix Search in Rotated Sorted Array", "concept": "Binary Search", "difficulty": "HARD", "statement": "Given a rotated sorted array of distinct integers and a target value, return the index of the target, or -1 if it does not exist, using O(log N) binary search. The supplied implementation narrows the search space toward the wrong half when the target lies within the sorted left half.", "task": "Fix the branch that should shrink the search space toward the sorted left half without changing the overall binary-search approach.", "constraints": "1 ≤ array length ≤ 10^5; all elements are distinct; -10^9 ≤ nums[i], target ≤ 10^9.", "tests": [["nums=[4,5,6,7,0,1,2], target=0", "4"], ["nums=[4,5,6,7,0,1,2], target=3", "-1"]] }
];

const TOTAL = QUESTIONS.length;
const LIMIT = 20 * 60;

// Universal language check patterns
const SUBMIT_CHECKS = [
    // Q1: save next before overwriting
    /(?:(?:next|nxt|next_node)\s*=\s*curr(?:->|\.)next[\s\S]*curr(?:->|\.)next\s*=\s*prev[\s\S]*curr\s*=\s*(?:next|nxt|next_node)|curr\.next,\s*prev,\s*curr\s*=\s*prev,\s*curr,\s*curr\.next)/,
    // Q2: return st.empty() or len(st) == 0 or isEmpty() or top == 0
    /(?:return\s*st\.empty\(\)\s*;?|return\s*st\.isEmpty\(\)\s*;?|return\s*(?:len\(st\)\s*==\s*0|not\s*st)\s*;?|return\s*top\s*==\s*0\s*;?)/,
    // Q3: curSum = max(nums[i], curSum + nums[i])
    /(?:curSum|cur_sum)\s*=\s*(?:Math\.)?max\(\s*nums\[i\],\s*(?:curSum|cur_sum)\s*\+\s*nums\[i\]\)/,
    // Q4: merged max end
    /(?:merged\.back\(\)\[1\]\s*=\s*max\(merged\.back\(\)\[1\],\s*iv\[1\]\)|merged\[-1\]\[1\]\s*=\s*max\(merged\[-1\]\[1\],\s*iv\[1\]\)|merged\.get\(merged\.size\(\)\s*-\s*1\)\[1\]\s*=\s*(?:Math\.)?max|merged\[count\s*-\s*1\]\[1\]\s*=\s*max)/,
    // Q5: hi = mid - 1
    /(?:nums\[lo\]\s*<=\s*target\s*(?:&&|and)\s*target\s*<\s*nums\[mid\]\s*\)?\s*(?:\{|:)?\s*hi\s*=\s*mid\s*-\s*1)/
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
    } catch { /* ignore quota */ }
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
