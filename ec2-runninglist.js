
var AWS = require('aws-sdk');
var uuid = require('node-uuid');


AWS.config.update({region: 'us-east-1'});


var s3 = new AWS.S3();
var ec2 = new AWS.EC2();



// var bucketName = 'node-sdk-sample-' + uuid.v4();
exports.handler = function(event, context, callback) {
ec2.describeInstances(function(err, result, data, callback) {
                    if (err)
                        console.log(err);
                    var inst_id = '-';
		    console.log('no. instances:' + result.Reservations.length);
                    for (var i = 0; i < result.Reservations.length; i++) {
                        var res = result.Reservations[i];
                        var instances = res.Instances;
                        for (var j = 0; j < instances.length; j++) {
                            var instanceID = instances[j].InstanceId;
                            var state = instances[j].State.Code;
                            var public_ip = instances[j].PublicIpAddress;
                            var imageID = instances[j].ImageId;
			    var instanceName = '';
                    		for(var t=0,tlen=instances[j].Tags.length; t<tlen; ++t) {
                        		if(instances[j].Tags[t].Key === 'Name') {
                            		instanceName = instances[j].Tags[t].Value;
                        		}
                    		}
			    var os = require('os');
                            console.log('instance ' + instanceID + " state " + state + " public ip " + public_ip + 'image id ' + imageID + 'Name:' + instanceName);
                            var dataTemp = 'instance ' + instanceID + " state " + state + " public ip " + public_ip + 'image id ' + imageID + 'Name:' + instanceName + os.EOL;
			    data = data + dataTemp;
                        }
		    }
  		const resu = {
			"statusCode": 200,
			"headers": {},
			"body": JSON.stringify(data)
		};
		if(context) {context.succeed(resu);}
	});
};
