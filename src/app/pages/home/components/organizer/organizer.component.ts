import {Component, OnInit} from '@angular/core'
import {DateService, DestroyService, TaskService, Task} from '../../../../shared'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {switchMap, takeUntil} from 'rxjs/operators'

@Component({
  selector: 'organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.less']
})
export class OrganizerComponent implements OnInit {
  form: FormGroup | any
  tasks: Task[] = []

  constructor(
    public dateService: DateService,
    private taskService: TaskService,
    private destroy$: DestroyService
  ) { }

  ngOnInit() {
    this.dateService.date
      .pipe(
        switchMap(value => this.taskService.load(value)),
        takeUntil(this.destroy$)
      )
      .subscribe(tasks => {
        this.tasks = tasks
      }, err => console.error(err))

    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    })
  }

  submit() {
    const {title} = this.form.value

    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    }

    this.taskService.create(task)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(task => {
        this.tasks.push(task)
        this.form.reset()
      }, err => console.error(err))
  }

  remove(task: Task) {
    this.taskService.remove(task)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.tasks = this.tasks.filter(item => item.id !== task.id)
      }, err => console.error(err))
  }
}
