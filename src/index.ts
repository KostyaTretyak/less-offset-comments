export interface Comment
{
  userId: number;
  children: Comment[];
  hasOffset?: boolean;
  parent?: Comment;
  [key: string]: any;
}

export class LessOffsetComments
{
  /**
   * Checks comment on the rules for exiting from "compact mode".
   */
  static hasOffset(comment: Comment): boolean
  {
    if(!comment.parent){ return; }

    if
    (
      !comment.parent.parent
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
      return true;
    }
  }

  /**
   * Checks comment on the rules for exiting from "compact mode"
   * and seting `hasOffset` to `true` in appropriate cases.
   */
  static updateOffset(comment: Comment): void
  {
    if(!comment.hasOffset && this.hasOffset(comment))
      comment.hasOffset = true;
  }

  /**
   * - inserts a new comment at the beginning of the `parent.children` array
   * - updates `hasOffset` propery of this new comment
   * - updates `hasOffset` propery of two neighboring comments in `comment.parent.children`.
   * 
   * @param parent A parent comment.
   * @param newChild A new comment that will be inserted into `parent.children` array.
   */
  static unshiftComment(parent: Comment, newChild: Comment): void
  {
    this.setComment(parent, newChild, 'unshift');
  }

  /**
   * - inserts a new comment at the end of the `parent.children` array
   * - updates `hasOffset` propery of this new comment
   * - updates `hasOffset` propery of two neighboring comments in `comment.parent.children`.
   * 
   * @param parent A parent comment.
   * @param newChild A new comment that will be inserted into `parent.children` array.
   */
  static pushComment(parent: Comment, newChild: Comment): void
  {
    this.setComment(parent, newChild, 'push');
  }

  /**
   * Deletes a specific comment and updates `hasOffset` propery
   * of two neighboring comments in `comment.parent.children`, taking into account this deletion.
   * 
   * @param comments Array of all comments. Required to remove root comments.
   * @param comment A comment for delete.
   * @param index An index of comment in `parent.children`
   * or in `comments` array (if it is root comment) for delete current comment.
   */
  static deleteComment(comments: Comment[], comment: Comment, index: number): void
  {
    if(!comment)
    {
      return;
    }
    else if(!comment.parent)
    {
      comments.splice(index, 1);
      return;
    }

    comment.parent.children.splice(index, 1);
    const child1 = comment.parent.children[0];

    if(child1)
    {
      delete child1.hasOffset;
      this.updateOffset(child1);

      const child2 = child1.children[0];
      if(child2)
      {
        delete child2.hasOffset;
        this.updateOffset(child2);
      }
    }
  }

  /**
   * - inserts a new comment at the beginning or at the end of the `parent.children` array
   * - updates `hasOffset` propery of this new comment
   * - updates `hasOffset` propery of two neighboring comments in `comment.parent.children`.
   * 
   * @param parent A parent comment.
   * @param newChild A new comment that will be inserted into `parent.children` array.
   * @param action An action that will be applied to the `parent.children` array.
   */
  private static setComment(parent: Comment, newChild: Comment, action: 'unshift' | 'push'): void
  {
    const child1 = parent.children[0];
    parent.children[action](newChild);
    this.updateOffset(newChild);

    if(child1)
    {
      this.updateOffset(child1);
      const child2 = child1.children[0];

      if(child2)
        this.updateOffset(child2);
    }
  }
}
