var AmpersandState = require('ampersand-state'),
    moment         = require('moment');
    
var Source = AmpersandState.extend({
  props: {
    title: "string",
    author: "string",
    template: { type: "string", default: "post.html" },
    collection: { type: "string", default: "blog" },
    d: "date",
    customSlug: "string"
  },
  derived: {
    permalink: {
      deps: ['collection', 'date'],
      fn: function() {
        var date = moment(this.d);
        return "/" + date.get('year') + "/" + date.get('month') + "/" + this.slug
      }
    },
    date: {
      deps: ['d'],
      fn: function() {
        
      }
    }
  }
});

module.exports = Source;

title: Hello world!
author: edorsey
template: post.html
collection: blog
permalink: /2010/10/hello-world/
year: 2010
month: 10
date: 2010-10-05