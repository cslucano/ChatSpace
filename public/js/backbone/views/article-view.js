Puls3.Views.Article = Backbone.View.extend({
	tagName: "article",
	className: "post",
	initialize: function () {
		
		this.template = _.template( $('#article-template').html() )
	},
	render: function () {
		var data = this.model.toJSON()
		var html = this.template(data)

		this.$el.html(html)
	}
})