import {
  Directive,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';

export interface Comment
{
  userId: number;
  level: number;
  parent: Comment;
  children: Comment[];
  compactMode: boolean;
  [key: string]: any;
}

@Directive({selector: '[less-offset-comments]'})
export class LessOffsetCommentsDirective implements OnChanges
{
  @Input() comments: Comment[];
  @Output() doOffset = new EventEmitter<Comment>();

  ngOnChanges(simpleChanges: SimpleChanges)
  {
    if
    (
      simpleChanges.comments.currentValue
      && simpleChanges.comments.currentValue.length
    )
    {
      this.comments.forEach( this.checkComment.bind(this) );
    }
  }

  /**
   * Вставляє новий коментар на початок чи в кінець масиву коментарів.
   */
  setComment(parent: Comment, newChild: Comment, action: 'unshift' | 'push')
  {
    const existChild1 = parent.children[0];

    parent.children[action](newChild);

    this.checkComment(newChild);

    if(existChild1)
    {
      this.checkComment(existChild1);
      const existChild2 = existChild1.children[0];

      if(existChild2)
        this.checkComment(existChild2);
    }
  }

  /**
   * Перевіряє кожен із коментарів на правила для виходу з компактного режиму.
   * 
   * Його потрібно використовувати для кожного із елементів в масиві коментарів при ініціалізації,
   * а також при вибірковій перевірці, коли масив змінено.
   */
  checkComment(comment: Comment)
  {
    if(comment.compactMode && comment.parent)
    {
      if
      (
        comment.parent.level == 1
        || comment.parent.children.length > 1
        ||
        (
          comment.parent.parent
          &&
          (
            comment.parent.parent.userId != comment.userId
            || comment.parent.parent.children.length > 1
          )
        )
      )
      {
        comment.compactMode = false;
        this.doOffset.emit(comment);
      }
    }
  }
}
