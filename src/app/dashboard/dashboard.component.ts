
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  todos: { _id?: string; description: string; completed: boolean }[] = [];
  newTodo = { description: '', completed: false };
  apiUrl = 'http://localhost:3000/todos'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchTodos();
  }

  fetchTodos() {
    this.http.get<any[]>(this.apiUrl).subscribe((data) => {
      this.todos = data;
    });
  }

  addTodo() {
    if (this.newTodo.description.trim()) {
      this.http.post(this.apiUrl, this.newTodo).subscribe((todo: any) => {
        this.todos.push(todo);
        this.newTodo = { description: '', completed: false };
      });
    }
  }

  deleteTodo(id: string | undefined) {
    if (id) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.todos = this.todos.filter((todo) => todo._id !== id);
      });
    }
  }

  toggleTodoCompletion(todo: any) {
    const updatedTodo = { ...todo, completed: !todo.completed };
    this.http.put(`${this.apiUrl}/${todo._id}`, updatedTodo).subscribe((updated: any) => {
      const index = this.todos.findIndex((t) => t._id === updated._id);
      if (index !== -1) {
        this.todos[index] = updated;
      }
    });
  }
}

