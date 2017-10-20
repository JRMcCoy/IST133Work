"use strict";

function addTaskElement(taskName) {

	var $task = $("<li></li>");
	var $delete = $("<button class='delete'>X</button>");
	var $moveUp = $("<button class='move-up'>^</button>");
	var $moveDown = $("<button class='move-down'>v</button>");
	
	$("#task-list").append($task);
	$task.text(taskName);
	
	$task.append($delete);
	$task.append($moveUp);
	$task.append($moveDown);
	
	$delete.click(function() {$task.remove();});
	$moveUp.click(function() {$task.insertBefore($task.prev());});
	$moveDown.click(function() {$task.insertAfter($task.next());});
}

function addTask() {
	var taskName = $("#new-task-name").val();
	if (taskName) {
		addTaskElement(taskName);
		$("#new-task-name").val("").focus();
	}
}


function TaskAtHandApp()
{
	var version = "v1.0";

	function setStatus(message)
	{
		$("#app>footer").text(message);
	}

	this.start = function()
	{
		$("#new-task-name").keypress(function(e) {
			if (e.which == 13) {
				addTask();
				return false;
			}
		}).focus();
				
		
		$("#app>header").append(version);
		setStatus("ready");
	};
} 

$(function() {
	window.app = new TaskAtHandApp();
	window.app.start();
});