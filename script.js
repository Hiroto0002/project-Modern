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