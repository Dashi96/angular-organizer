import {Injectable, OnDestroy} from '@angular/core'
import {Observable, Subject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DestroyService extends Observable<void> implements OnDestroy {
  private readonly _life$ = new Subject<void>()

  constructor() {
    super(subscriber => this._life$.subscribe(subscriber))
  }

  ngOnDestroy() {
    this._life$.next()
    this._life$.complete()
  }
}
