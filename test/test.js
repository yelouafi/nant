var assert = require("assert")
var hot = require("../hot");

describe('hot', function(){
  describe('html', function(){
    it('should build html tag with body', function(){
        
        var html = hot.html(
            hot.head(
                hot.title('Hot templating')
            ) + 
            hot.body(
                hot.p({ style: 'font-weight: bold;color: gold;'},'hot templating i as easy as writing javascript code')    
            )
        )
        
        assert.equal(''+html, '<html><head><title>Hot templating</title></head><body><p style="font-weight: bold;color: gold;">hot templating i as easy as writing javascript code</p></body></html>');
    })
  })
})