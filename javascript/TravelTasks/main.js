var TaskApp = TaskApp || {};

var TaskApp = (function(){
    var fn, api, cache;
    
    cache = {
        subtaskBtn: document.getElementsByClassName('subtaskBtn'),
        taskBtn: document.getElementsByClassName('taskBtn'),
        componentBtn: document.getElementsByClassName('componentBtn'),
        mainContainer: document.getElementById('mainContainer'),
        componentContainer: document.getElementById('componentContainer')
    }
    
    window.aa = fn = {
        
        _subtasks:[],
        _tasks: {},
        _components: [],
        
        _init: function(){
            fn._bindEvents();
        },
        
        _bindEvents: function(){
            mainContainer.addEventListener('click', function(e){
                target = e.target;
                var targetClass = target.getAttribute('class');
                
                if(!targetClass){
                    return;
                }
                
                if(targetClass.indexOf('componentBtn') > -1){
                    var currComp = fn._components.length+1;
                    fn._components.push(currComp);
                    var component = fn._createNewComponent(currComp);
                    cache.componentContainer.appendChild(component);
                }
                else if(targetClass.indexOf('subtaskBtn') > -1){
                    var subtask = fn._createNewSubtask(componentIndex);
                }
                else if(targetClass.indexOf('taskBtn') > -1){
                    var componentIndex = target.getAttribute('ids');
                    var task = fn._createNewTask(componentIndex);
                    document.getElementById('component'+componentIndex).appendChild(task);
                    if(!fn._tasks[componentIndex]){
                        fn._tasks[componentIndex] = [];
                    }
                    fn._tasks[componentIndex].push(task);
                }
                
            });
        },
        
        _createNewComponent: function(currComp){
            var html = '';
            html += '<button class="taskBtn btn" ids="'+currComp+'">create task</button>';
            var newEle = document.createElement('div');
            newEle.setAttribute('class', 'component');
            newEle.setAttribute('id', 'component'+currComp);
            newEle.innerHTML = html;
            return newEle;
        },
        
        _createNewTask: function(componentIndex){
            var newEle = document.createElement('div');
            newEle.setAttribute('class', 'task');
            newEle.setAttribute('index', componentIndex);
            newEle.innerHTML = '<input type="text" value="" placeholder="write task" /><button class="subtaskBtn btn" >create subtask</button>';
            return newEle;
        },
        
        _createNewSubtask: function(){
            
        }
    };
    
    api = {
        init: function(){
            return fn._init.apply(this, arguments);
        }
    };
    
    return api;
    
})();
