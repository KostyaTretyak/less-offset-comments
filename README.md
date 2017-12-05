## What is this for?

This is utility for less offset in nested comments.

## Main idea

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

What is the main idea here? Dialogue between two users may not be offset.

For all comments, this utility changes the property `hasOffset` to `true` or to `false`.
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
  children: this[];
  hasOffset?: boolean;
  parent?: this;
  [key: string]: any;
}
```

### Methods

All methods of this utility are called statically.

```ts
static hasOffset(comment: Comment): boolean;

static updateOffset(comment: Comment): void;

static unshiftComment(parent: Comment, newChild: Comment): void;

static pushComment(parent: Comment, newChild: Comment): void;

static deleteComment(comments: Comment[], comment: Comment, index: number): void;
```

## Usage

When rendering comments, and when you walk through the comments tree,
you should call `LessOffsetComments.updateOffset()` for each of them.

And then, for insert and delete a comment,
you should using `LessOffsetComments.unshiftComment()` and `LessOffsetComments.deleteComment()` like this:

```ts
import { LessOffsetComments, Comment } from 'less-offset-comments';

class MyComponent
{
  comments: Comment[];

  onSubmit(parent: Comment)
  {
    const child: Comment =
    {
      userId: 111111,
      parent: parent,
      children: []
    };

    LessOffsetComments.unshiftComment(parent, child);
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

  <li *if="comment.hasOffset">
    <ul>
      <li>
        <!-- Your template for comment here -->
        userId: {{ comment.userId }}
        <button (click)="onSubmit(comment)">Sumbit</button>
        <button (click)="onDelete(comment, index)">Delete</button>
      </li>
    </ul>
  </li>
  <li *if="!comment.hasOffset">
    <!-- Your template for comment here -->
    userId: {{ comment.userId }}
    <button (click)="onSubmit(comment)">Sumbit</button>
    <button (click)="onDelete(comment, index)">Delete</button>
  </li>

  <!-- / end foreach -->
</ul>
```

## Example of usage with Angular 5

Check out this [repository](https://github.com/KostyaTretyak/less-offset-comments-demo)
specifically created for the [demo](https://kostyatretyak.github.io/less-offset-comments-demo/)
