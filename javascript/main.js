var TREE_OVERLAP = 4;
var NUMBER_OF_TREES = 15;

function supportsSvg() {
	return document.implementation &&
		(
			document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.0") ||
			document.implementation.hasFeature("SVG", "1.0")
		);
}
	
function getTree(trees, selector) {
	var tree = trees.select(selector).attr({
		'class': 'tree'
	});
	
	tree.transform(
		'S 0.3 0.3 0 0'
	);
	
	var bbox = tree.getBBox();

	tree.transform(
		'S 0.3 0.3 0 0' + 
		'T ' + (-1 * bbox.x) + ' ' + (150 + TREE_OVERLAP - bbox.y2)
	);

	return tree;
}

if (supportsSvg()) {
	window.onload = function() {
		
		var paper = Snap('#forest');
		
		paper.node.setAttribute('viewBox', '0 0 ' + paper.node.offsetWidth + ' ' + paper.node.offsetHeight);
		
		Snap.load('images/trees.svg', function(trees) {
			var treePaths = [];
			for (var treeTypeIndex = 1; treeTypeIndex <= 7; treeTypeIndex++) {
				try {
					treePaths.push(getTree(trees, '#tree' + treeTypeIndex));
				} catch (error) {
					console.log(error);
				}
			}
			
			var growATree = function() {
				var treeType = Math.floor(Math.random() * 7);
				
				var tree = treePaths[treeType].clone();
				var bbox = tree.getBBox();
				
				var x = positions.pop();//Math.round(paper.node.offsetWidth * (Math.random() * 1.1 - 0.05));
			
				var treeContainer = paper.g().attr({
					transform: 'translate(' + x + '), matrix(0.5 0 0 0 ' + (bbox.cx * 0.5) + ' ' + 150 + ')'
				});
				
				treeContainer.append(tree);
				
				var scale = Math.random() * 0.4 + 0.7;
				treeContainer.animate({
					transform: 'translate(' + x + '), matrix(' + scale + ' 0 0 ' + scale + ' 0 ' + (150 * (1 - scale)) + ')'
				}, 300, mina.bounce);
				
				setTimeout(function() {
					if (numberOfTrees++ < maxTrees) {
						growATree();
					}
				}, Math.random() * 2000);
			};
			
			var positions = [];
			
			var numberOfTrees = 0;
			var maxTrees = Math.round(window.innerWidth / 40);
			if (isNaN(maxTrees)) {
				maxTrees = NUMBER_OF_TREES;
			}
			
			for (var treeIndex = 0; treeIndex < maxTrees; treeIndex++) {
				positions.push(window.innerWidth * (treeIndex + 0.3) / maxTrees);
				positions.push(window.innerWidth * (treeIndex + 0.7) / maxTrees);
			}
			
			positions.sort(function(a, b) {
				return Math.random() - 0.5;	
			});
			
			setTimeout(growATree(), 2000);
			numberOfTrees++;
			
		});
	};
}