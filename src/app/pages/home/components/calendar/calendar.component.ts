import {Component, OnInit} from '@angular/core'
import {DateService, Task, Week} from '../../../../shared'
import {TaskService} from '../../../../shared/services/task.service'
import {finalize} from 'rxjs/operators'
import * as moment from 'moment'

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.less']
})
export class CalendarComponent implements OnInit {
  calendar: Week[] = []
  tasks: Task[] = []

  constructor(
    private dateService: DateService,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    this.taskService.loadAllTasks()
      .pipe(
        finalize(() => {
          this.dateService.date.subscribe(this.generate.bind(this))
        })
      )
      .subscribe(tasks => {
        this.tasks = tasks
      }, err => console.error(err))
  }

  generate(now: moment.Moment) {
    const startDay = now.clone().startOf('month').startOf('week');
    const endDay = now.clone().endOf('month').endOf('week');

    const date = startDay.clone().subtract(1, 'day');

    const calendar = [];

    while (date.isBefore(endDay, 'day')) {
      calendar.push({
        days: Array(7)
          .fill(0)
          .map(() => {
            const value = date.add(1, 'day').clone();
            const active = moment().isSame(value, 'date');
            const disabled = !now.isSame(value, 'month');
            const selected = now.isSame(value, 'date');
            let tasksCount = 0;

            this.tasks.forEach(item => {
              if (value.format('DD-MM-YYYY') === item.id) {
                tasksCount = Object.values(item).length - 1
              }
            })

            return {
              value,
              active,
              disabled,
              selected,
              tasksCount
            }
          })
      })
    }

    this.calendar = calendar;
  }

  select(day: moment.Moment) {
    this.dateService.changeDate(day)
  }
}
