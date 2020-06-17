<script>
	export default {
		onLaunch: function() {
			console.log(`-------------- app onLaunch ------------- `)
			return new Promise(resolve => {
				setTimeout(() => {
					console.log("onLaunch");
					resolve();
				}, 1000)
			})
		},
		onUnload:function(){
			console.log("onUnload");
		},
		onReady:function(){
			console.log("onReady");
		},
		onLoad:function(){
			console.log("onLoad");
		},
		// onShow: function() {
		// 	console.log("onShow");
		// },
		onHide:function(){
			console.log("onHide");
		},
		onError:function(){
			console.log("onError");
		},
	};
</script>

<style>
	/*每个页面公共css */
</style>
