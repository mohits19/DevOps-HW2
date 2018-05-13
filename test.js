let subject = require('C:/Users/mohit/Desktop/DevOps/HW2/DevOps-HW2/mystery.js')
let mock = require('mock-fs');
try { subject.inc(105, -77); } catch (e) {} 
try { subject.inc(105, NaN); } catch (e) {} 
try { subject.inc(95, -77); } catch (e) {} 
try { subject.inc(95, NaN); } catch (e) {} 
try { subject.weird(101, 18, 40, "mode"); } catch (e) {} 
try { subject.weird(101, 18, 40, 'NEQ - mode'); } catch (e) {} 
try { subject.weird(101, 18, 40, 'street'); } catch (e) {} 
try { subject.weird(101, 18, 40, 'xstreet'); } catch (e) {} 
try { subject.weird(101, 18, 40, "strictly"); } catch (e) {} 
try { subject.weird(101, 18, 40, 'NEQ - strictly'); } catch (e) {} 
try { subject.weird(101, 18, 29, "mode"); } catch (e) {} 
try { subject.weird(101, 18, 29, 'NEQ - mode'); } catch (e) {} 
try { subject.weird(101, 18, 29, 'street'); } catch (e) {} 
try { subject.weird(101, 18, 29, 'xstreet'); } catch (e) {} 
try { subject.weird(101, 18, 29, "strictly"); } catch (e) {} 
try { subject.weird(101, 18, 29, 'NEQ - strictly'); } catch (e) {} 
try { subject.weird(101, 1, 40, "mode"); } catch (e) {} 
try { subject.weird(101, 1, 40, 'NEQ - mode'); } catch (e) {} 
try { subject.weird(101, 1, 40, 'street'); } catch (e) {} 
try { subject.weird(101, 1, 40, 'xstreet'); } catch (e) {} 
try { subject.weird(101, 1, 40, "strictly"); } catch (e) {} 
try { subject.weird(101, 1, 40, 'NEQ - strictly'); } catch (e) {} 
try { subject.weird(101, 1, 29, "mode"); } catch (e) {} 
try { subject.weird(101, 1, 29, 'NEQ - mode'); } catch (e) {} 
try { subject.weird(101, 1, 29, 'street'); } catch (e) {} 
try { subject.weird(101, 1, 29, 'xstreet'); } catch (e) {} 
try { subject.weird(101, 1, 29, "strictly"); } catch (e) {} 
try { subject.weird(101, 1, 29, 'NEQ - strictly'); } catch (e) {} 
try { subject.weird(98, 18, 40, "mode"); } catch (e) {} 
try { subject.weird(98, 18, 40, 'NEQ - mode'); } catch (e) {} 
try { subject.weird(98, 18, 40, 'street'); } catch (e) {} 
try { subject.weird(98, 18, 40, 'xstreet'); } catch (e) {} 
try { subject.weird(98, 18, 40, "strictly"); } catch (e) {} 
try { subject.weird(98, 18, 40, 'NEQ - strictly'); } catch (e) {} 
try { subject.weird(98, 18, 29, "mode"); } catch (e) {} 
try { subject.weird(98, 18, 29, 'NEQ - mode'); } catch (e) {} 
try { subject.weird(98, 18, 29, 'street'); } catch (e) {} 
try { subject.weird(98, 18, 29, 'xstreet'); } catch (e) {} 
try { subject.weird(98, 18, 29, "strictly"); } catch (e) {} 
try { subject.weird(98, 18, 29, 'NEQ - strictly'); } catch (e) {} 
try { subject.weird(98, 1, 40, "mode"); } catch (e) {} 
try { subject.weird(98, 1, 40, 'NEQ - mode'); } catch (e) {} 
try { subject.weird(98, 1, 40, 'street'); } catch (e) {} 
try { subject.weird(98, 1, 40, 'xstreet'); } catch (e) {} 
try { subject.weird(98, 1, 40, "strictly"); } catch (e) {} 
try { subject.weird(98, 1, 40, 'NEQ - strictly'); } catch (e) {} 
try { subject.weird(98, 1, 29, "mode"); } catch (e) {} 
try { subject.weird(98, 1, 29, 'NEQ - mode'); } catch (e) {} 
try { subject.weird(98, 1, 29, 'street'); } catch (e) {} 
try { subject.weird(98, 1, 29, 'xstreet'); } catch (e) {} 
try { subject.weird(98, 1, 29, "strictly"); } catch (e) {} 
try { subject.weird(98, 1, 29, 'NEQ - strictly'); } catch (e) {} 
try{
	mock({emptyDir:mock.directory(),nonEmptyDir:mock.directory({ items: { file: mock.file() } }),file:mock.file(),pathContent:{file1:new Buffer('abc'),someDir:mock.directory()}});
		subject.fileTest('file', 'emptyDir');
	mock.restore();
} catch(e) {}
try{
	mock({pathContent:{file1:new Buffer('abc'),someDir:mock.directory()}});
		subject.fileTest('file', 'emptyDir');
	mock.restore();
} catch(e) {}
try{
	mock({emptyDir:mock.directory(),nonEmptyDir:mock.directory({ items: { file: mock.file() } }),file:mock.file()});
		subject.fileTest('file', 'emptyDir');
	mock.restore();
} catch(e) {}
try{
	mock({});
		subject.fileTest('file', 'emptyDir');
	mock.restore();
} catch(e) {}
try{
	mock({emptyDir:mock.directory(),nonEmptyDir:mock.directory({ items: { file: mock.file() } }),file:mock.file(),pathContent:{file1:new Buffer('abc'),someDir:mock.directory()}});
		subject.fileTest('file', 'nonEmptyDir');
	mock.restore();
} catch(e) {}
try{
	mock({pathContent:{file1:new Buffer('abc'),someDir:mock.directory()}});
		subject.fileTest('file', 'nonEmptyDir');
	mock.restore();
} catch(e) {}
try{
	mock({emptyDir:mock.directory(),nonEmptyDir:mock.directory({ items: { file: mock.file() } }),file:mock.file()});
		subject.fileTest('file', 'nonEmptyDir');
	mock.restore();
} catch(e) {}
try{
	mock({});
		subject.fileTest('file', 'nonEmptyDir');
	mock.restore();
} catch(e) {}
try{
	mock({emptyDir:mock.directory(),nonEmptyDir:mock.directory({ items: { file: mock.file() } }),file:mock.file(),pathContent:{file1:new Buffer('abc'),someDir:mock.directory()}});
		subject.fileTest('pathContent/file1', 'emptyDir');
	mock.restore();
} catch(e) {}
try{
	mock({pathContent:{file1:new Buffer('abc'),someDir:mock.directory()}});
		subject.fileTest('pathContent/file1', 'emptyDir');
	mock.restore();
} catch(e) {}
try{
	mock({emptyDir:mock.directory(),nonEmptyDir:mock.directory({ items: { file: mock.file() } }),file:mock.file()});
		subject.fileTest('pathContent/file1', 'emptyDir');
	mock.restore();
} catch(e) {}
try{
	mock({});
		subject.fileTest('pathContent/file1', 'emptyDir');
	mock.restore();
} catch(e) {}
try{
	mock({emptyDir:mock.directory(),nonEmptyDir:mock.directory({ items: { file: mock.file() } }),file:mock.file(),pathContent:{file1:new Buffer('abc'),someDir:mock.directory()}});
		subject.fileTest('pathContent/file1', 'nonEmptyDir');
	mock.restore();
} catch(e) {}
try{
	mock({pathContent:{file1:new Buffer('abc'),someDir:mock.directory()}});
		subject.fileTest('pathContent/file1', 'nonEmptyDir');
	mock.restore();
} catch(e) {}
try{
	mock({emptyDir:mock.directory(),nonEmptyDir:mock.directory({ items: { file: mock.file() } }),file:mock.file()});
		subject.fileTest('pathContent/file1', 'nonEmptyDir');
	mock.restore();
} catch(e) {}
try{
	mock({});
		subject.fileTest('pathContent/file1', 'nonEmptyDir');
	mock.restore();
} catch(e) {}
try { subject.normalize('3563974232'); } catch (e) {} 
try { subject.format('0723391633', '', true); } catch (e) {} 
try { subject.format('0723391633', '', false); } catch (e) {} 
try { subject.format('0723391633', '', { strongbow: 'true' }); } catch (e) {} 
try { subject.format('0723391633', '', { strongbow: 'false' }); } catch (e) {} 
try { subject.blackListNumber('7529641073'); } catch (e) {} 
try { subject.blackListNumber('2129892476'); } catch (e) {} 
try { subject.blackListNumber('3093528476'); } catch (e) {} 
