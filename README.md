# Obsidian Tasks Annotate

<!-- ![License](https://img.shields.io/github/license/wombozo/obsidian-tasks-annotate) -->
<!-- ![GitHub release (latest by date)](https://img.shields.io/github/v/release/wombozo/obsidian-tasks-annotate?style=flat-square) -->


An [Obsidian](https://obsidian.md/) plugin that helps you annotate your tasks with tags and / or file tasks.

```
- [ ] #task/topic1 #task/topic2 #topic3 [[tasks/task-TaskFile1|TaskFile1]] Text of the task.
```

The list of tags is to be defined, as well as the pattern for task linking, and the alias (the pattern in the example above would be `[[{filename}|{alias}]]`, and the alias pattern would be `task-`).

I personnaly use this plugin to help link Zetteltasken workflow, [Task](https://github.com/obsidian-tasks-group/obsidian-tasks) plugin, [dataview](https://github.com/blacksmithgu/obsidian-dataview) plugin and [Colored Tag Wrangler](https://github.com/code-of-chaos/obsidian-colored_tags_wrangler).

## Screenshots

![screenshot-exemple.png](https://raw.githubusercontent.com/wombozo/tasks-annotate/master/assets/screenshot-exemple.png)

***

![screenshot-options.png](https://raw.githubusercontent.com/wombozo/tasks-annotate/master/assets/screenshot-options.png)

***

![screenshot-mainmenu.png](https://raw.githubusercontent.com/wombozo/tasks-annotate/master/assets/screenshot-mainmenu.png)

## Evolutions

- [ ] Support other link formats than `absolute`
- [ ] Support non wikilinks

## Installation

So far, only manual install works :

- Clone this repo
- Run `npm run build`
- Copy `main.js`, `styles.css` and `manifest.json` into your `plugins/` directory inside `.obsidian/`

## Use

When installed, go to settings and enable whatever decoration you want to your tasks.

Then only one command is needed : `Annotate Task` : You will be prompted with tags or file to link.


## Suggestion

My workflow is to have as in the example in the settings :

- The task pattern (`- [ ]`)
- The tags (`#task/tag1 #task/tag2`)
- The Linked file (`[T::[[path/to/tasks/task-123456|123456]]]`)
- The text of the task
- Some properties from the Task plugin (due date, priority, ...)


For the task link, the reason I do this, is to have the link to the filetask as a property (inline dataview property).

In my workflow, `path/to/tasks` is the directory where I keep all my file tasks, that are files with bigger description, merely files with notes for this tag (as "Add note from tasks from [Kanban](https://publish.obsidian.md/kanban/How+do+I/Create+notes+from+cards) plugin").
Every tasks have the same name pattern : `task-<uuid>`, and some aliases. (I have some help from [templater](https://github.com/SilentVoid13/Templater) plugin)


File `task-01be35a1` :

```yaml
---
task: Task description
id: 01be35a1
title: task-01be35a1
tags: [type/task, topic1]
aliases: [01be35a1, Task description]
created: 2024-04-16
---

Here you can in your template show every tasks that link that taskfile. For example :

> [!INFO] 
> ```tasks
> description includes 01be35a1
> ```


So I worked on this issue. Here is how to solve it....

```

And in my dailies :

```markdown
- [x] #task/topic1 [T::[[tasks/task-01be35a1|01be35a1]]] Start thinking on how to solve this. [due:: today]
- [ ] #task/topic1 [T::[[tasks/task-01be35a1|01be35a1]]] Finish this task, it's been too long ! [due:: today] [priority:: medium]
```

If you are worry that the `T` property is too cumbersome, you can hide it in a custom snippet :

```css

:root {
    --highlight-task-color: #b7d6a9;
}

.dataview.inline-field[data-dv-key="T"] a[href] {
    background-color: var(--highlight-task-color);
    color: #000;
    border-radius: 5px;
    padding: 5px;
}

.dataview.inline-field:has(> .dataview.inline-field-key[data-dv-key="T"] + .dataview.inline-field-value a[href]) {
    background-color: var(--highlight-task-color);
    color: #ffffff;
    border-radius: 10px;
    padding: 1px;
    text-decoration: none;
}

/* .dataview.inline-field > .dataview.inline-field-key, */
.dataview.inline-field > .dataview.inline-field-value {
    background-color: inherit;
}

/* Remove T ! */
.dataview.inline-field-key[data-dv-key="T"] {
    display: none;
    color: #000000;
}

```


