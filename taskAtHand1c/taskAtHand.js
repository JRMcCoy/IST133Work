"use strict";


function TaskAtHandApp()
{
	var version = "v1.3";
	var appStorage = new AppStorage("taskAtHand");

	function setStatus(message) {
		$("#app>footer").text(message);
	}
	
	function saveTaskList() {
		var tasks = [];
		$("#task-list .task span.task-name").each(function() { tasks.push($(this).text()) });
		appStorage.setValue("taskList", tasks);
	}
	
	function loadTaskList() {
		var tasks = appStorage.getValue("taskList"); 
		if (tasks) {
			for (var i in tasks) addTaskElement(tasks[i]);
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
	
	function onChangeTaskName($input) {
		$input.hide();
		var $span = $input.siblings("span.task-name");
		if ($input.val()) {
			$span.text($input.val());
		}
		saveTaskList();
		$span.show();
	}

	function onEditTaskName($span) {
		$span.hide().siblings("input.task-name").val($span.text()).show().focus();
	}

	function addTaskElement(taskName) {
		var $task = $("#task-template .task").clone();
		$("span.task-name", $task).text(taskName);
		$("#task-list").append($task);

		$("button.delete", $task).click(function() {
			$task.remove();
			saveTaskList();
		});
		$("button.move-up", $task).click(function() {
			$task.insertBefore($task.prev());
			saveTaskList();
		});
		$("button.move-down", $task).click(function() {
			$task.insertAfter($task.next());
			saveTaskList();
		});
		
		$("span.task-name", $task).click(function() {
			onEditTaskName($(this));
		});
		$("input.task-name", $task).change(function() {
			onChangeTaskName($(this));}).blur(function() {$this.hide().siblings("span.task-name").show();
		});
	}

	function addTask() {
		var taskName = $("#new-task-name").val();
		if (taskName) {
			addTaskElement(taskName);
			saveTaskList();
			$("#new-task-name").val("").focus();
		}
	}
	
} 

$(function() {
	window.app = new TaskAtHandApp();
	window.app.start();
});