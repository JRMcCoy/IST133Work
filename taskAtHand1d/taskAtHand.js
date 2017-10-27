"use strict";


function TaskAtHandApp()
{
	var version = "v1.4";
	var appStorage = new AppStorage("taskAtHand");
	var undoUtility = new stateStack(10);
	var currentTasks = [];

	function setStatus(message) {
		$("#app>footer").text(message);
	}
	
	function loadTaskList() {
		var tasks = appStorage.getValue("taskList");
		if (tasks) {
			for (var i in tasks) addTaskElement(tasks[i]);
		}
	}
	
	function onChangeTaskName($input) {
		$input.hide();
		var $span = $input.siblings("span.task-name");
		if ($input.val()) {
			saveTaskList(function() { $span.text($input.val()); });
		}
		$span.show();
	}

	function onEditTaskName($span) {
		$span.hide().siblings("input.task-name").val($span.text()).show().focus();
	}
	
	function packageCurrentList() {
		var tasks = [];
		$("#task-list .task span.task-name").each(function() { tasks.push($(this).text()) });
		return tasks;
	}
	
	function saveTaskList(action) {
		undoUtility.pushState(packageCurrentList());
		action();
		var t = packageCurrentList();
		appStorage.setValue("taskList", t);
	}
	
	function unpackTaskList(tasks) {
		for (var i in currentTasks) currentTasks[i].remove();
		currentTasks = [];
		for (var i in tasks) addTaskElement(tasks[i]);
		appStorage.setValue("taskList", packageCurrentList());
	}
	
	this.handleUndo = function() {
		var tasks = undoUtility.popState();
		if (tasks != null) {
			unpackTaskList(tasks);
		}
	}
	
	this.start = function() {
		$("#new-task-name").keypress(function(e) {
			if (e.which == 13) {
				addTask();
				return false;
			}
		}).focus();
		
		$("#app>header").append(version);
		loadTaskList();
		setStatus("ready");
	};

	function addTask() {
		var taskName = $("#new-task-name").val();
		if (taskName) {
			saveTaskList(function() { addTaskElement(taskName); });
			$("#new-task-name").val("").focus();
		}
	}
	
	function addTaskElement(taskName) {
		var $task = $("#task-template .task").clone();
		$("span.task-name", $task).text(taskName);
		$("#task-list").append($task);

		$("button.delete", $task).click(function() {
			saveTaskList(function() { $task.remove(); });
		});
		$("button.move-up", $task).click(function() {
			saveTaskList(function() { $task.insertBefore($task.prev()); });
		});
		$("button.move-down", $task).click(function() {
			saveTaskList(function() { $task.insertAfter($task.next()); });
		});
		
		$("span.task-name", $task).click(function() {
			onEditTaskName($(this));
		});
		$("input.task-name", $task).change(function() {
			onChangeTaskName($(this));}).blur(function() {$this.hide().siblings("span.task-name").show();
		});
		
		currentTasks.push($task);
	}
	
} 

$(function() {
	window.app = new TaskAtHandApp();
	window.app.start();
});