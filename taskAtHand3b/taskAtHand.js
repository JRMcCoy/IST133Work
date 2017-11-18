"use strict";

function TaskAtHandApp()
{
	var version = "v3.2";
	var appStorage = new AppStorage("taskAtHand");
	var taskList;

	function setStatus(message) {
		$("#app>footer").text(message);
	}
	
	function saveTaskList() {
		appStorage.setValue("taskList", taskList);
	}
	
	function loadTaskList() {
		taskList = appStorage.getValue("taskList");
		if (tasks) {
			var tasks = taskList.getTasks();
			for (var i in tasks) addTaskElement(tasks[i]);
		}
		else {
			taskList = new TaskList();
		}
	}

	this.start = function() {
		$("#new-task-name").keypress(function(e) {
			if (e.which == 13) {
				addTask();
				return false;
			}
		}).focus();
		
		$("#theme").change(onChangeTheme);
				
		
		$("#app>header").append(version);
		loadTaskList();
		setStatus("ready");
	};
	
	function onChangeTheme() {
		var theme = $("#theme>option").filter(":selected").val();
		setTheme(theme);
		appStorage.setValue("theme", theme);
	}
	
	function setTheme(theme) {
		$("#theme-style").attr("href", "themes/" + theme + ".css"); 
	}
	
	function loadTheme() {
		var theme = appStorage.getValue("theme");
		if (theme) {
			setTheme(theme);
			$("#theme>option[value=" + theme +"]").attr("selected", "selected");
		}
	}
	
	function onChangeTaskName($input) {
		$input.hide();
		var $span = $input.siblings("span.task-name");
		if ($input.val()) {
			$span.text($input.val());
			alert($span.text());
		}
		saveTaskList();
		$span.show();
	}

	function onEditTaskName($span) {
		$span.hide().siblings("input.task-name").val($span.text()).show().focus();
	}
	
	function onSelectTask($task) {
		if ($task) {
			$task.siblings(".selected").removeClass("selected");
			$task.addClass("selected");
		}
	}

	function addTaskElement(task) {
		var $task = $("#task-template .task").clone();
		$task.data("task-id", task.id);
		$task.id = task.id;
		$task.name = task.name;
		$("span.task-name", $task).text(task.name);
		$("#task-list").append($task);
		
		$(".details input", ".details select", $task).each(function() {
			var $input = $(this);
			var fieldName = $input.data("field");
			$input.val(task[fieldName]);
		});

		$("button.delete", $task).click(function() {
			taskList.removeTask($task.id);
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
			saveTaskList();
		});
		
		$("input.task-name", $task).change(function() {
			onChangeTaskName($(this));}).blur(function() {$this.hide().siblings("span.task-name").show();
		});
		
		$task.click(function() { onSelectTask($task);});
		
		$("button.toggle-details", $task).click(function() { toggleDetails($task);});
	}

	function addTask() {
		var taskName = $("#new-task-name").val();
		if (taskName) {
			var task = new Task(taskName);
			taskList.addTask(task);
			appStorage.setValue("nextTaskId", Task.nextTaskId);
			addTaskElement(task);
			saveTaskList();
			$("#new-task-name").val("").focus();
		}
	}
	
	function toggleDetails($task) {
		$(".details", $task).slideToggle();
		$("button.toggle-details", $task).toggleClass("expanded");
	}
	
} 

$(function() {
	window.app = new TaskAtHandApp();
	window.app.start();
});