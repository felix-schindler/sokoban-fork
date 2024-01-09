"use strict";

import Sokoban from "./sokoban.mjs";
import { maps } from "./maps.mjs";

/**
 * @param {number} level Level to check
 * @returns {boolean} Whether the level is valid
 */
function validLevel(level) {
	return !isNaN(level) && level > 0 && level <= maps.length;
}

window.onload = () => {
	let lastWon = parseInt(localStorage.getItem("level"));
	let reqLevel = parseInt(
		new URLSearchParams(window.location.search).get("level"),
	);

	// Check if requested one is valid or not
	// when not valid, use the last won level
	// when last won level also not valid, use level 1
	if (!validLevel(reqLevel)) {
		if (validLevel(++lastWon)) {
			reqLevel = lastWon;
		} else {
			reqLevel = 1;
		}
	}

	const stageSelect = document.getElementById("stageSelect"),
		gotoStage = document.getElementById("gotoStage");

	for (let i = 0; i < maps.length; i++) {
		const option = document.createElement("option");
		const level = i + 1;
		option.textContent = "Level " + level;
		if (level === reqLevel) {
			option.selected = true;
		}
		stageSelect.appendChild(option);
	}

	const emptyImage = document.getElementById("emptyImage"),
		wallImage = document.getElementById("wallImage"),
		floorImage = document.getElementById("floorImage"),
		targetImage = document.getElementById("targetImage"),
		cargoImage = document.getElementById("cargoImage"),
		cargoOnTargetImage = document.getElementById("cargoOnTargetImage"),
		keeperImage = document.getElementById("keeperImage"),
		keeperOnTargetImage = document.getElementById("keeperOnTargetImage");

	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");
	const patterns = Object.freeze({
		0: context.createPattern(emptyImage, "repeat"),
		1: context.createPattern(wallImage, "repeat"),
		2: context.createPattern(floorImage, "repeat"),
		3: context.createPattern(targetImage, "repeat"),
		4: context.createPattern(cargoImage, "repeat"),
		5: context.createPattern(cargoOnTargetImage, "repeat"),
		6: context.createPattern(keeperImage, "repeat"),
		7: context.createPattern(keeperOnTargetImage, "repeat"),
	});

	document.body.removeChild(emptyImage);
	document.body.removeChild(wallImage);
	document.body.removeChild(floorImage);
	document.body.removeChild(targetImage);
	document.body.removeChild(cargoImage);
	document.body.removeChild(cargoOnTargetImage);
	document.body.removeChild(keeperImage);
	document.body.removeChild(keeperOnTargetImage);

	const sokoban = new Sokoban(patterns);
	sokoban.playMap(reqLevel - 1);

	document.addEventListener("keydown", function (event) {
		let handled = false;

		switch (event.code) {
			case "ArrowUp":
				sokoban.moveUp();
				handled = true;
				break;
			case "ArrowLeft":
				sokoban.moveLeft();
				handled = true;
				break;
			case "ArrowRight":
				sokoban.moveRight();
				handled = true;
				break;
			case "ArrowDown":
				sokoban.moveDown();
				handled = true;
				break;
			case "Space":
				sokoban.playMap(sokoban.mapIndex);
				handled = true;
				break;
		}

		if (handled) event.preventDefault();
	});

	const upButton = document.getElementById("upButton"),
		leftButton = document.getElementById("leftButton"),
		downButton = document.getElementById("downButton"),
		rightButton = document.getElementById("rightButton"),
		restartButton = document.getElementById("restartButton");

	upButton.addEventListener("click", () => sokoban.moveUp());
	leftButton.addEventListener("click", () => sokoban.moveLeft());
	downButton.addEventListener("click", () => sokoban.moveDown());
	rightButton.addEventListener("click", () => sokoban.moveRight());
	restartButton.addEventListener("click", () => sokoban.playMap(sokoban.mapIndex));

	gotoStage.addEventListener("click", () => {
		for (let i = 0; i < stageSelect.children.length; i++) {
			if (stageSelect.children[i].selected) {
				sokoban.playMap(i);
			}
		}
	});

	sokoban.play();
};
