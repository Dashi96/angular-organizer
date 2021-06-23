import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {CreateResponse, Task} from '../interfaces'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'
import * as moment from 'moment'

const url: string = 'https://angular-organizer-3e83f-default-rtdb.firebaseio.com/tasks'

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient) { }

  load(date: moment.Moment): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(
        map(tasks => {
          if (!tasks) {
            return []
          } else {
            return Object.keys(tasks).map((key: any) => ({...tasks[key], id:key}))
          }
        })
      )
  }

  loadAllTasks(): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${url}.json`)
      .pipe(
        map(tasks => {
          if (!tasks) {
            return []
          } else {
            return Object.keys(tasks).map((key: any) => ({...tasks[key], id:key}))
          }
        })
      )
  }

  create(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${url}/${task.date}.json`, task)
      .pipe(
        map(response => {
          return {...task, id: response.name}
        })
      )
  }

  remove(task: Task): Observable<void> {
    return this.http.delete<void>(`${url}/${task.date}/${task.id}.json`)
  }
}
