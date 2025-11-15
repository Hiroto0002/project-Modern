// 1. HTML要素の取得
// DOM（Document Object Model）を操作するために、HTMLに付けたIDを使って要素を取得します
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');

// 2. イベントリスナーの設定
// 「追加」ボタンがクリックされたときに、addTask関数を実行するように設定します
addButton.addEventListener('click', addTask);

// 入力フィールドでEnterキーが押されたときも、addTask関数を実行するように設定します
todoInput.addEventListener('keypress', function(event) {
    // keycode 13 または key 'Enter' は、Enterキーが押されたことを示します
    if (event.key === 'Enter') {
        addTask();
    }
});


// 3. タスクを追加する関数
function addTask() {
    // ユーザーが入力したテキストを取得し、両端の空白を削除します
    const taskText = todoInput.value.trim();

    // 入力が空だった場合、タスクを追加せずに処理を終了します
    if (taskText === '') {
        alert('タスクを入力してください！');
        return;
    }

    // 新しいタスクのリストアイテム（<li>）を作成します
    const listItem = document.createElement('li');
    
    // タスクの内容を表示する要素を作成
    const taskContent = document.createElement('span');
    taskContent.textContent = taskText;
    taskContent.classList.add('task-content');

    // 削除ボタンを作成します
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.classList.add('delete-btn');

    // 削除ボタンがクリックされたときの処理を設定します
    deleteButton.addEventListener('click', function() {
        // このボタンの親要素（<li>）をリストから削除します
        todoList.removeChild(listItem);
    });

    // タスクをクリックすると、完了（取り消し線）にする機能を追加します
    taskContent.addEventListener('click', function() {
        // 'completed'というクラスを追加したり削除したりして、見た目を切り替えます
        listItem.classList.toggle('completed');
    });

    // 作成した要素を<li>に追加します
    listItem.appendChild(taskContent);
    listItem.appendChild(deleteButton);

    // <li>をTODOリスト（<ul>）の最後に追加します
    todoList.appendChild(listItem);

    // タスクを追加した後、入力フィールドを空にします
    todoInput.value = '';
    todoInput.focus();
}

// --- 新しい関数 ---
// タスクデータをlocalStorageから読み込み、HTMLに表示する
function loadTasks() {
    // localStorageから 'tasks' というキーで保存されているデータを取得
    // データがない場合は空の配列 [] を使う
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // 取得したタスク一つ一つについて、HTML要素を作成して表示する
    tasks.forEach(task => {
        // loadTasksは、addTaskがHTML要素を作る部分だけを再利用する
        createTaskElement(task.text, task.isCompleted);
    });
}

// タスクデータをlocalStorageに保存する
function saveTasks() {
    // 現在のTODOリストの<li>要素を全て取得する
    const listItems = todoList.querySelectorAll('li');
    const tasks = [];

    // <li>一つ一つからタスクのテキストと完了状態を取得
    listItems.forEach(item => {
        tasks.push({
            // タスクのテキストを取得
            text: item.querySelector('.task-content').textContent,
            // 'completed'クラスがあるか（完了状態か）をチェック
            isCompleted: item.classList.contains('completed')
        });
    });

    // JavaScriptのオブジェクト（tasks）を文字列（JSON形式）に変換して保存
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
// -----------------


// 2. イベントリスナーの設定 (saveTasks呼び出しを追加)
addButton.addEventListener('click', addTask);
todoInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// アプリが起動したときにタスクを読み込む！
document.addEventListener('DOMContentLoaded', loadTasks);


// 3. タスクを追加する関数 (修正)
function addTask() {
    const taskText = todoInput.value.trim();
    if (taskText === '') {
        alert('タスクを入力してください！');
        return;
    }

    // HTML要素を作成してリストに追加
    createTaskElement(taskText, false); // 新規タスクなので完了状態は false

    // データの保存を実行
    saveTasks(); 

    // 入力フィールドを空にしてフォーカスを戻す (変更なし)
    todoInput.value = '';
    todoInput.focus();
}

// 4. HTML要素を作成する共通関数 (新規作成)
// この関数が<li>要素を作り、イベントを設定する役割を担います
function createTaskElement(text, isCompleted) {
    const listItem = document.createElement('li');
    
    // 完了状態であれば 'completed' クラスを追加
    if (isCompleted) {
        listItem.classList.add('completed');
    }

    const taskContent = document.createElement('span');
    taskContent.textContent = text;
    taskContent.classList.add('task-content');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.classList.add('delete-btn');

    // --- イベントリスナーの処理を修正 ---
    deleteButton.addEventListener('click', function() {
        todoList.removeChild(listItem);
        saveTasks(); // 削除したら保存！
    });

    taskContent.addEventListener('click', function() {
        listItem.classList.toggle('completed');
        saveTasks(); // 完了状態が変わったら保存！
    });
    // ---------------------------------

    listItem.appendChild(taskContent);
    listItem.appendChild(deleteButton);
    todoList.appendChild(listItem);
}