## What is this for?

This is utility for less offset in nested comments.

## Main idea of this "less offset comments"

Traditional tree-like comments may be as follows:

```text
user1
  user2
    user1
      user2
        user4
        user1
          user2
            user1
              user2
                user1
                  user2
                    user1
                      user2
                        user3
                          user2
                            user3
                              user2
```

And what if we do the following:

```text
user1
  user2
  user1
  user2
    user4
    user1
      user2
      user1
      user2
      user1
      user2
      user1
      user2
        user3
        user2
        user3
        user2
```

What is the main idea here? Dialogs between two users may not be offseted.

For all comments, this utility changes the property `compactMode` to `true` or to `false`.
A developer should rely on this property when rendering the comments.

## API

### Comments interface

To use this utility, your comments should be implemented this TypeScript interface:

```ts
interface Comment
{
  userId: number;
  level: number;
  parent: Comment;
  children: Comment[];
  compactMode: boolean;
  [key: string]: any;
}
```

- `compactMode` by default should have `true`
- `level` start from `1`
- `children` should always be an array

### Methods

All methods of this utility are called statically.

```ts
static init(comments: Comment[]);

static setComment(parent: Comment, newChild: Comment, action: 'unshift' | 'push');

static deleteComment(comments: Comment[], comment: Comment, index: number);

static checkComment(comment: Comment);
```

## Usage

Example of usage:

```ts
import { LessOffsetComments, Comment } from 'less-offset-comments';

OnInit()
{
  this.comments: Comments[] = getFromBackend();

  LessOffsetComments.init(this.comments);
}

onSubmit(parent: Comment)
{
  const child: Comment =
  {
    userId: 111111,
    level: parent.level + 1,
    parent: parent,
    children: [],
    compactMode: true
  };

  LessOffsetComments.setComment(parent, child, 'unshift');
}

onDelete(comment: Comment, index: number)
{
  LessOffsetComments.deleteComment(this.comments, comment, index);
}

```

And in your view like this (Angular code):

```html
<ng-container *ngFor="let comment of comments; index as i">
  <li *ngIf="comment.compactMode">
    <ng-container *ngTemplateOutlet="template; context: {comment: comment, index: i}"></ng-container>
  </li>
  <li *ngIf="!comment.compactMode">
    <ul>
      <ng-container *ngTemplateOutlet="template; context: {comment: comment, index: i}"></ng-container>
    </ul>
  </li>
</ng-container>

<ng-template let-comment="comment" let-index="index" #template>
  <br>userId: {{ comment.userId }}
  <br><input type="submit" (click)="onSubmit(comment)">
  <br><input type="submit" (click)="onDelete(comment, index)" value="delete">
  <thread [comments]="comment.children"></thread>
</ng-template>
```

Where `thread` is custom Angular component and this is its view.