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
    console.log(simpleChanges);

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
    const child1 = parent.children[0];
    parent.children[action](newChild);
    this.checkComment(newChild);

    if(child1)
    {
      this.checkComment(child1);
      const child2 = child1.children[0];

      if(child2)
        this.checkComment(child2);
    }
  }

  /**
   * Видаляє конкретний коментар та оновлює зміщення сусідніх коментарів,
   * враховуючи це видалення.
   */
  deleteComment(parent: Comment, index: number)
  {
    parent.children.splice(index, 1);
    const child1 = parent.children[0];

    if(child1)
    {
      child1.compactMode = true;
      this.checkComment(child1);

      const child2 = child1.children[0];
      if(child2)
      {
        child2.compactMode = true;
        this.checkComment(child2);
      }
    }
  }

  /**
   * Перевіряє кожен із коментарів на правила для виходу з компактного режиму.
   * 
   * Використовується безпосередньо при ініціалізації масиву коментарів.
   * При вставці або видаленні конкретного коментаря,
   * необхідно використовувати відповідно setComment() та deleteComment().
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
