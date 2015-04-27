
var elastictest = require('../');

module.exports.tests = {};

module.exports.tests.example = function(test, common) {

  test('example', function(t) {

    var suite = new elastictest.Suite();

    var doc = {
      index: suite.props.index,
      type: 'mytype',
      id: '1',
      body: {
        foo: 'bar'
      }
    };

    suite.action( function( done ){
      suite.client.index( doc, done );
    });

    suite.assert( function( done ){
      suite.client.count({
        index: doc.index,
        type: doc.type
      }, function( err, res ){
        t.equal( res.count, 1, 'record count' );
        done();
      });
    });

    suite.assert( function( done ){
      suite.client.get({
        index: doc.index,
        type: doc.type,
        id: doc.id
      }, function( err, res ){
        t.equal( res.found, true );
        t.equal( res._id, doc.id );
        t.equal( res._index, doc.index );
        t.equal( res._type, doc.type );
        t.deepEqual( res._source, doc.body );
        t.equal( res._version, 1 );
        done();
      });
    });

    suite.run( t.end );

  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('Suite: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};