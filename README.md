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

## Install

```bash
npm install less-offset-comments --save
```

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

class MyComponent
{
  comments: Comment[];

  onInit()
  {
    this.comments = getFromBackend();

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
}

```

And in your view like this pseudo-code:

```html
<ul>
  <!-- You want to covered the following code in foreach -->

  <li *if="comment.compactMode">
    <!-- Your template for comment here -->
    userId: {{ comment.userId }}
    <button (click)="onSubmit(comment)">Sumbit</button>
    <button (click)="onDelete(comment, index)">Delete</button>
  </li>
  <li *if="!comment.compactMode">
    <ul>
      <li>
        <!-- Your template for comment here -->
        userId: {{ comment.userId }}
        <button (click)="onSubmit(comment)">Sumbit</button>
        <button (click)="onDelete(comment, index)">Delete</button>
      </li>
    </ul>
  </li>

  <!-- / end foreach -->
</ul>
```
