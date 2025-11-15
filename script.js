// =================================================================
// 1. HTML要素の取得と定数
// =================================================================
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todoList = document.getElementById('todo-list');
const gaugeFill = document.getElementById('storage-gauge-fill');
const sizeText = document.getElementById('storage-size-text');

const MAX_STORAGE_BYTES = 200; // ゲージの最大容量 (約5MB)

// =================================================================
// 2. ストレージ容量計算とゲージ表示の関数
// =================================================================
function getStorageSize() {
    let totalBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        if (key && value) {
            totalBytes += key.length * 2;
            totalBytes += value.length * 2;
        }
    }
    return totalBytes;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function displayStorageSize() {
    const sizeInBytes = getStorageSize();
    const readableSize = formatBytes(sizeInBytes);
    
    let percentage = (sizeInBytes / MAX_STORAGE_BYTES) * 100;
    
    // 💡 修正 2: 容量超過時のテキストと色の設定
    if (percentage > 100) {
        percentage = 100; // ゲージの幅は100%で止める
        gaugeFill.style.backgroundColor = '#dc3545'; // 赤色
        
        // 警告メッセージを表示
        sizeText.textContent = "容量がでかすぎるッ!!!"; 
        sizeText.style.color = '#dc3545'; // テキストの色も赤にする
        
    } else if (percentage > 50) {
        gaugeFill.style.backgroundColor = '#ffc107'; // オレンジ
        sizeText.style.color = '#777'; // 通常のテキスト色に戻す
        sizeText.textContent = `${readableSize} / ${formatBytes(MAX_STORAGE_BYTES)}`;
    } else {
        gaugeFill.style.backgroundColor = '#007bff'; // 青
        sizeText.style.color = '#777'; // 通常のテキスト色に戻す
        sizeText.textContent = `${readableSize} / ${formatBytes(MAX_STORAGE_BYTES)}`;
    }
    
    gaugeFill.style.width = `${percentage}%`; 
}

// =================================================================
// 3. データの保存・読み込み関数
// =================================================================

function saveTasks() {
    const listItems = todoList.querySelectorAll('li');
    const tasks = [];

    listItems.forEach(item => {
        tasks.push({
            text: item.querySelector('.task-content').textContent,
            isCompleted: item.classList.contains('completed')
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayStorageSize(); // 保存後にゲージを更新！
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        createTaskElement(task.text, task.isCompleted);
    });
}

// =================================================================
// 4. HTML要素の生成・操作関数
// =================================================================

function createTaskElement(text, isCompleted) {
    const listItem = document.createElement('li');
    
    if (isCompleted) {
        listItem.classList.add('completed');
    }

    const taskContent = document.createElement('span');
    taskContent.textContent = text;
    taskContent.classList.add('task-content');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.classList.add('delete-btn');

    // 削除イベント
    deleteButton.addEventListener('click', function() {
        todoList.removeChild(listItem);
        saveTasks(); // 削除後に保存
    });

    // 完了/未完了の切り替えイベント
    taskContent.addEventListener('click', function() {
        listItem.classList.toggle('completed');
        saveTasks(); // 状態変更後に保存
    });

    listItem.appendChild(taskContent);
    listItem.appendChild(deleteButton);
    todoList.appendChild(listItem);
}


function addTask() {
    const taskText = todoInput.value.trim();
    if (taskText === '') {
        alert('タスクを入力してください！');
        return;
    }

    createTaskElement(taskText, false); // 新規タスクを作成
    saveTasks(); // 保存を実行 (この中でゲージも更新されます)

    todoInput.value = '';
    todoInput.focus();
}


// =================================================================
// 5. イベントリスナーとアプリの起動処理 (すべてここに集約)
// =================================================================

// 「追加」ボタンのクリックイベント
addButton.addEventListener('click', addTask);

// 入力フィールドでのEnterキーイベント
todoInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// ページが完全に読み込まれたときにタスクを読み込み、ゲージを表示
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    displayStorageSize(); 
});

