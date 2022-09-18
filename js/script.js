let todo = {
	data: [],
	getTodo: function(i){
		return document.querySelector(`[data-index="${i}"]`);
	},
	buttonEdit: function(i){
		let parent = this.getTodo(i);
		if(parent.classList.contains('edit')){
			parent.classList.remove('edit')
		}else{
			parent.classList.add('edit')
		}
	},
	buttonDelete: function(i){
		if(this.data[i]){
			let answer = confirm(`Are you sure you want to delete:\n${this.data[i].text}`);
			if(answer){
				this.data = this.data.filter((todo,index)=>{
					return index != i
				});
				this.render();
				this.sync();
			}
		}
	},
	buttonComplete: function(i){
		if(this.data[i]){
			this.data[i].completed = this.data[i].completed == true ? false : true;
			this.render();
			this.sync();
		}
	},
	buildTodo: function(todo, i){
		return 	`<div class="todo__row ${todo.completed ? 'complete': ''}" data-index="${i}">
					<div class="todo__row__default">
						<div class="todo__row__text">${todo.text}</div>
						<div class="todo__row__edit todo__button" onclick="todo.buttonEdit(${i})"><span class="material-icons">edit</span></div>
					</div>
					<div class="todo__row__change">
						<input class="todo__row__input" onkeyup="todo.inputUpdate(${i})" value="${todo.text}">
						<div class="todo__row__complete todo__button" onclick="todo.buttonComplete(${i})"><span class="material-icons">done</span></div>
						<div class="todo__row__delete todo__button" onclick="todo.buttonDelete(${i})"><span class="material-icons">delete</span></div>
						<div class="todo__row__unedit todo__button" onclick="todo.buttonEdit(${i})"><span class="material-icons">close</span></div>
					</div>
				</div>`;
	},
	inputUpdate: function(i){
		let parent = this.getTodo(i);
		let text = parent.querySelector('.todo__row__text');
		if(this.data[i]){
			this.data[i].text = event.target.value;
			text.innerText = event.target.value;
			this.sync();
		}
	},
	inputCreate: function(){
		let input = document.querySelector('#todo__post__input');
		if(input.value && input.value.length > 0){
			this.data.push({text: input.value, completed: false,});
			this.render();
			input.value = '';
			this.sync();
		}
	},
	render: function(){
		let completed = this.data.reduce((acc, todo)=>{
			if(todo.completed){acc++}
			return acc
		}, 0)
		let head = document.querySelector('#todo__head');
			head.innerHTML = `Completed: ${completed}/${this.data.length}`;
		let body = document.querySelector('#todo__body');
			body.innerHTML = '';
		this.data.forEach((todo, i)=>{
			body.innerHTML += this.buildTodo(todo, i);
		});
	},
	save: function(){
		console.log('save');
		localStorage.setItem('todo', JSON.stringify(this.data));
	},
	wait: false,
	sync: function(){
		if(this.wait === false){
			this.wait = true;
			setTimeout(()=>{
				this.wait = false;
				this.save();
			},2000);
		}
	},
	init: function(){
		let data = localStorage.getItem('todo');
		if(data === null){
			this.save();
		}else{
			this.data = JSON.parse(data);
		}
		this.render();
	},
};
