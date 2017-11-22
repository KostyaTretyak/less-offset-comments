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

export class LessOffsetComments
{
  static init(comments: Comment[])
  {
    comments.forEach( this.checkComment.bind(this) );
  }

  /**
   * Inserts a new comment at the beginning or at the end of the comments array.
   * 
   * @param parent A parent comment.
   * @param newChild A new comment that will be inserted into `parent.children` array.
   * @param action An action that will be applied to the `parent.children` array.
   */
  static setComment(parent: Comment, newChild: Comment, action: 'unshift' | 'push')
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
   * Deletes a specific comment and updates the offset of neighboring comments,
   * taking into account this deletion.
   * 
   * @param comments Array of all comments. Required to remove root comments.
   * @param comment A comment for delete.
   * @param index An index of comment in `parent.children` array for delete current comment.
   */
  static deleteComment(comments: Comment[], comment: Comment, index: number)
  {
    if(!comment)
    {
      return;
    }
    else if(!comment.parent)
    {
      return comments.splice(index, 1);
    }

    comment.parent.children.splice(index, 1);
    const child1 = comment.parent.children[0];

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
   * Checks each comment on the rules for exiting "Compact Mode".
   */
  static checkComment(comment: Comment)
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
      }
    }
  }
}
