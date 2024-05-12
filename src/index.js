
const express = require('express');
const fs = require('fs');
const https = require("https");
const cors = require('cors');
const os = require('os');
const db = require("./models");
const dataServices = require('./util/dataServices.js');



const app = express();
app.use(express.json());

app.use(cors({
    origin: '*'
}));

// db.sequelize.sync();

const { environment, port }= require('./config/config');

app.get('/', async (req, res) => {
    res.status(200).json({ "data" : "message hi"});
})

app.get('/getHomeDirTest', async (req, res) => {
    var homeDir = os.homeDir
    console.log(os.homedir());
    res.status(200).json({ homeDir: homeDir });
})

app.get('/getMyOpenThreads', async (req, res) => {

    var myId = req.query.loginId;

    if (!req.query.loginId) {
        res.status(400).json({ error: "login id is not specified" });
        return;
    }

    try {
        const myOpenThreads = await dataServices.getMyOpenThreads(myId);
        res.status(200).json({ myOpenThreads });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

app.get('/getMyClosedThreads', async (req, res) => {

    var myId = req.query.loginId;

    if (!req.query.loginId) {
        res.status(400).json({ error: "login id is not specified" });
        return;
    }

    try {
        const myClosedThreads = await dataServices.getMyClosedThreads(myId);
        res.status(200).json({ myClosedThreads });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

app.get('/getMessagesForThread', async (req, res) => {
    var threadId = req.query.threadId;

    if (!req.query.threadId) {
        res.status(400).json({ error: "login id is not specified" });
        return;
    }

    try {
        const threadMsgs = await dataServices.getAllMsgsForComm(threadId);
        res.status(200).json({ threadMsgs });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})


app.get('/getAllComm', async (req, res) => {

    try {
        const allChapters = await dataServices.getAllComm();
        res.status(200).json({ data: allChapters });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

app.get('/getAllProfiles', async (req, res) => {

    try {
        const profiles = await dataServices.getAllProfiles();
        res.status(200).json({ profiles });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

app.get('/getCommThreadById', async(req, res) => {

    if (!req.query.commId) {
        res.status(400).json({ error: "Comm id is not specified - cannot fetch comm" });
        return;
    }

    var commId = req.query.commId;
    try {
        const comm = await dataServices.getCommById(commId);
        res.status(200).json({ comm });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})





app.post('/signup/user', async (req, res) => {
    try {
      const user = await db.users.create(req.body);
      res.status(200).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: error });
    }
  });
  
  // Endpoint to create a doctor
  app.post('/signup/doctor', async (req, res) => {
    try {
      const doctor = await db.doctor.create(req.body);
      res.status(200).json(doctor);
    } catch (error) {
      console.error('Error creating doctor:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


app.post('/createNewUser',async(req,res)=>{
    var usersData=req.body;
  //  var usersData.id=usersData.id+1;
    var user_id=usersData.user_id;
    var name=usersData.name;
    var speciality=usersData.speciality;
    var email=usersData.email;
    var password=usersData.password;
    var ConformPassword=usersData.ConformPassword;

    console.log(usersData);
    console.log(name);
    console.log(email);
    console.log(speciality);
     //console.log(password);
    // console.log(ConformPassword);


    try{
        const cre= await dataServices.AddUser(email,password).then((result)=>{
            console.log("successfully created users document")
            res.status(200).json({data:result});

            dataServices.addusertoDoctor(name,speciality,email,password).then((result2)=>{
                res.status(200).json({data:result2});
            }).catch(function (error) {
                console.log('Error')
                console.log(error)
            });


           
        }).catch(function (error) {
            console.log("error in the create user : "+ error)
        });
    }
    catch(e){
         console.log(e);
        res.sendStatus(500);
    }


})

app.post('/createNewCommMsg', async (req, res) => {

    var commData = req.body;
    var fromId = commData.fromId;
    var fromName = commData.fromName
    var toId = commData.toId;
    var toName = commData.toName;
    var message = commData.message;


    console.log("Going to save comm msg with the following parameters");
    console.log(commData);
    console.log(fromId);
    console.log(fromName);
    console.log(toId);
    console.log(toName);
    console.log(message);

    try {

        const msg = await dataServices.createComm(fromId, fromName, toId, toName, message)
            .then((result) => {
                console.log('Successfully created comm thread with first message')
                console.log(result)
                res.status(200).json({ data: result });
            })
            .catch(function (error) {
                console.log(error)
            });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }

})


app.post('/addCommMsg', async (req, res) => {

    var commData = req.body;
    var commId = commData.commId;
    var fromId = commData.fromId;
    var message = commData.message;

    console.log("Going to add a new message to existing thread")
    console.log(commData);

    try {

        const msg = await dataServices.createCommMsg(commId, fromId, message)
            .then((result) => {
                console.log('Whoooa Successfully added comm message')
                console.log(result)
                res.status(200).json({ data: result });
            })
            .catch(function (error) {
                console.log(error)
            });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }

})


app.post('/closeThread', async (req, res) => {

    var commData = req.body;
    var commId = commData.commId;
    var fromId = commData.fromId;
    var fromName = commData.fromName
    var message = fromName + ' has indicated the communication loop can be closed.';

    var firstMessagePrefix = 'If you agree, please close the conversation.';

    try {

        var firstClose = true;

        await dataServices.getCommById(commId) 
        .then(async (ref) => {
            console.log(ref);
            console.log('First closed by value is ' + ref.closed_by_1)
            if (ref.closed_by_1) firstClose = false;
            else firstClose = true;
        
            if (firstClose) {
                message = message + ' ' + firstMessagePrefix
            }

            const msg = await dataServices.createCommMsg(commId, fromId, message)
                .then((result) => {
                    console.log('Whoooa Successfully added comm closed message')
                    console.log(result)

                    console.log('Now going to update the closing user details')

                    dataServices.updateClosedUserDetails(commId, fromId, firstClose ).then ((result2) => {
                        console.log('Whoooa Successfully updated closed by information')
                        console.log(result2)
                        res.status(200).json({ data: result })
                    }).catch (function (error) {
                        console.log(error)
                        res.sendStatus(500);
                    })
                
                })
                .catch(function (error) {
                    console.log(error)
                    res.sendStatus(500);
                });
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }

})

app.get('/weeklyRoster',  async (req, res) => {
    var doctorId = req.query.doctorId;

    if (!req.query.doctorId) {
        res.status(400).json({ error: "doctor id is not specified - cannot fetch roster" });
        return;
    }

    try {
        const weeklyRoster = await dataServices.getWeeklyRosterForDoctor(doctorId);
        res.status(200).json({ weeklyRoster });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

app.get('/doctorDetailsByEmail', async (req, res) => {

    var doctorEmail = req.query.email;

    if (!req.query.email) {
        res.status(400).json({ error: "doctor email is not specified - cannot get doctor details" });
        return;
    }

    try {
        const profile = await dataServices.getDoctorProfileByEmail(doctorEmail);

        res.status(200).json({ profile });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})


app.get('/doctorDetails',  async (req, res) => {
    var doctorId = req.query.doctorId;

    if (!req.query.doctorId) {
        res.status(400).json({ error: "doctor id is not specified - cannot get doctor details" });
        return;
    }

    try {
        const profile = await dataServices.getDoctorProfile(doctorId);

        const weeklyRoster = await dataServices.getWeeklyRosterForDoctor(doctorId);

        //const date = new Date();
        //const d = date.getDay(); // returns a number representing the day of the week, starting with 0 for Sunday
        //const h = date.getHours();
        //const m = date.getMinutes();
        //console.log(`UTC date is day ${d} and the time is ${h}:${m}.`);
        // ---
        var ausDate = new Date().toLocaleString("en-US", {timeZone: "Australia/Brisbane"});
        //console.log(ausDate);

        let parse = Date.parse(ausDate);

        let now = new Date(parse);
        //console.log(now);

        console.log('Checking online offline status for doctor ' + doctorId)

        //---
        const day = now.getDay(); // returns a number representing the day of the week, starting with 0 for Sunday
        const hours = now.getHours();
        const minutes = now.getMinutes();
        console.log(`Today is day ${day} and the time is ${hours}:${minutes}.`);

        if (profile.userOnlineStatus == '0') {
            profile.online = '0'
            console.log('This doctor is offline - so not checking roster')
        } else {
            var dayOfWeek = ''
            var weekDayFromHour = 0
            var weekDayFromMin = 0
            var weekDayToHour = 0
            var weekDayToMin = 0

            if (day == 0) {
                dayOfWeek = 'sunday'
                weekDayFromHour = weeklyRoster.sunday_from_hour
                weekDayFromMin = weeklyRoster.sunday_from_min
                weekDayToHour = weeklyRoster.sunday_to_hour
                weekDayToMin = weeklyRoster.sunday_to_min
            }
            else if (day == 1) {
                dayOfWeek = 'monday'
                weekDayFromHour = weeklyRoster.monday_from_hour
                weekDayFromMin = weeklyRoster.monday_from_min
                weekDayToHour = weeklyRoster.monday_to_hour
                weekDayToMin = weeklyRoster.monday_to_min
            }
            else if (day == 2) {
                dayOfWeek = 'tuesday'
                weekDayFromHour = weeklyRoster.tuesday_from_hour
                weekDayFromMin = weeklyRoster.tuesday_from_min
                weekDayToHour = weeklyRoster.tuesday_to_hour
                weekDayToMin = weeklyRoster.tuesday_to_min
            }
            else if (day == 3) {
                dayOfWeek = 'wednesday'
                weekDayFromHour = weeklyRoster.wednesday_from_hour
                weekDayFromMin = weeklyRoster.wednesday_from_min
                weekDayToHour = weeklyRoster.wednesday_to_hour
                weekDayToMin = weeklyRoster.wednesday_to_min
            }
            else if (day == 4) {
                dayOfWeek = 'thursday'
                weekDayFromHour = weeklyRoster.thursday_from_hour
                weekDayFromMin = weeklyRoster.thursday_from_min
                weekDayToHour = weeklyRoster.thursday_to_hour
                weekDayToMin = weeklyRoster.thursday_to_min
            }
            else if (day == 5) {
                dayOfWeek = 'friday'
                weekDayFromHour = weeklyRoster.friday_from_hour
                weekDayFromMin = weeklyRoster.friday_from_min
                weekDayToHour = weeklyRoster.friday_to_hour
                weekDayToMin = weeklyRoster.friday_to_min
            }
            else if (day == 6) {
                dayOfWeek = 'saturday'
                weekDayFromHour = weeklyRoster.saturday_from_hour
                weekDayFromMin = weeklyRoster.saturday_from_min
                weekDayToHour = weeklyRoster.saturday_to_hour
                weekDayToMin = weeklyRoster.saturday_to_min
            }

            console.log('Current hour is ' + hours + ' and current minutes ' + minutes)
            console.log('Week From Hour is ' + weekDayFromHour + ' and Week from min ' + weekDayFromMin)
            console.log('Week To Hour is ' + weekDayToHour + ' and Week from min ' + weekDayToMin)

            if ( hours >= weekDayFromHour && hours <= weekDayToHour) {
                console.log('Current hour ' + hours  + ' is within range')

                if (hours == weekDayToHour) {
                    if (  minutes <= weekDayToMin) {
                        console.log('Setting Online to 1 - Available')
                        profile.online = '1';
                    } else {
                        console.log('We just passed the minute - Setting to Offline')
                        profile.online = '0';
                    }
                } else {
                    console.log('Setting Online to 1 - Available - time not equal to toHour')
                    profile.online = '1';
                }
            } else {
                console.log('Setting Online to 0 - OFFLINE as hour is out of range')
                profile.online = '0';
            }
        }
        console.log('---------------------------------------------')
        res.status(200).json({ profile });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

app.post('/updateProfile', async (req, res) => {

    var data = req.body;
    var doctorId = data.id;

    if (!doctorId) {
        res.status(400).json({ error: "doctor id is not specified - cannot update profile" });
        return;
    }

    console.log("Going to check if profile data exists for the given doctor with Id " + doctorId);

    try {
        const profile = await dataServices.getDoctorProfile(doctorId)
            
        console.log(profile)
        console.log('Done printing profile data alraady existing for the given doctor')

        var docName = data.name
        var docPhone = data.phone
        var docSpeciality = data.speciality
        var docPractice = data.practice
        var docstatusMsg = data.status
        //var docOnline = data.online

        const updateDrDetails = dataServices.updateDoctorProfile(doctorId, docName, docPhone, docPractice,docSpeciality, docstatusMsg).then((result) => {
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^Roster profile date for the given doctor :' + doctorId)
            console.log(result)
            res.status(200).json({ data: result });
        })
        .catch(function (error) {
            console.log('Error in updateProfile Details for doctor')
            console.log(error)
        });

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }

})

app.post('/updateOnlineStatus', async (req, res) => {

    var data = req.body;
    var doctorId = data.doctorId;
    var onlineStatus = data.currentOnlineStatus

    console.log('About to change doctor online status')
    console.log(data)
    console.log ("Doctor Id is [" + doctorId + "] and onlineStatus is [" + onlineStatus +']')

    if (!doctorId) {
        res.status(400).json({ error: "doctor id is not specified - cannot update online status" });
        return;
    }

    console.log("Going to check if profile data exists for the given doctor with Id " + doctorId)

    const updateDrDetails = dataServices.updateOnlineStatus(doctorId, onlineStatus).then((result) => {
        console.log('Updated online status with current value for :' + doctorId)
        console.log(result)
        res.status(200).json({ data: result });
    })
    .catch(function (error) {
        console.log('Error in updateOnline Details for doctor')
        console.log(error)
    });
})

app.post('/addorUpdateWR', async (req, res) => {

    var rosterData = req.body;
    var doctorId = rosterData.doctorId;

    if (!doctorId) {
        res.status(400).json({ error: "doctor id is not specified - cannot add or update roster" });
        return;
    }

    console.log("Going to check if rosterData exists for the given doctor with Id " + doctorId);

    try {

        const weeklyRoster = await dataServices.getWeeklyRosterForDoctor(doctorId)
            
        console.log(weeklyRoster)
        console.log('Done printing roster data exists for the given doctor')
            
        var sundayOff = rosterData.sundayOff
        var mondayOff = rosterData.mondayOff
        var tuesdayOff = rosterData.tuesdayOff
        var wednesdayOff = rosterData.wednesdayOff
        var thursdayOff = rosterData.thursdayOff
        var fridayOff = rosterData.fridayOff
        var saturdayOff = rosterData.saturdayOff

        var sundayFromHour = rosterData.sundayFromHour
        var sundayFromMin = rosterData.sundayFromMin
        var sundayToHour = rosterData.sundayToHour
        var sundayToMin = rosterData.sundayToMin
        var sundayFromAmPm = rosterData.sundayFromAmPm
        var sundayToAmPm = rosterData.sundayToAmPm

        var mondayFromHour = rosterData.mondayFromHour
        var mondayFromMin = rosterData.mondayFromMin
        var mondayToHour = rosterData.mondayToHour
        var mondayToMin = rosterData.mondayToMin
        var mondayFromAmPm = rosterData.mondayyFromAmPm
        var mondayToAmPm = rosterData.mondayToAmPm

        var tuesdayFromHour = rosterData.tuesdayFromHour
        var tuesdayFromMin = rosterData.tuesdayFromMin
        var tuesdayToHour = rosterData.tuesdayToHour
        var tuesdayToMin = rosterData.tuesdayToMin
        var tuesdayFromAmPm = rosterData.tuesdayFromAmPm
        var tuesdayToAmPm = rosterData.tuesdayToAmPm

        var wednesdayFromHour = rosterData.wednesdayFromHour
        var wednesdayFromMin = rosterData.wednesdayFromMin
        var wednesdayToHour = rosterData.wednesdayToHour
        var wednesdayToMin = rosterData.wednesdayToMin
        var wednesdayFromAmPm = rosterData.wednesdayFromAmPm
        var wednesdayToAmPm = rosterData.wednesdayToAmPm

        var thursdayFromHour = rosterData.thursdayFromHour
        var thursdayFromMin = rosterData.thursdayFromMin
        var thursdayToHour = rosterData.thursdayToHour
        var thursdayToMin = rosterData.thursdayToMin
        var thursdayFromAmPm = rosterData.thursdayFromAmPm
        var thursdayToAmPm = rosterData.thursdayToAmPm

        var fridayFromHour = rosterData.fridayFromHour
        var fridayFromMin = rosterData.fridayFromMin
        var fridayToHour = rosterData.fridayToHour
        var fridayToMin = rosterData.fridayToMin
        var fridayFromAmPm = rosterData.fridayFromAmPm
        var fridayToAmPm = rosterData.fridayToAmPm

        var saturdayFromHour = rosterData.saturdayFromHour
        var saturdayFromMin = rosterData.saturdayFromMin
        var saturdayToHour = rosterData.saturdayToHour
        var saturdayToMin = rosterData.saturdayToMin
        var saturdayFromAmPm = rosterData.saturdayFromAmPm
        var saturdayToAmPm = rosterData.saturdayToAmPm

        var sundayPractice = rosterData.sundayPractice;
        var mondayPractice = rosterData.mondayPractice;
        var tuesdayPractice = rosterData.tuesdayPractice;
        var wednesdayPractice = rosterData.wednesdayPractice;
        var thursdayPractice = rosterData.thursdayPractice;
        var fridayPractice = rosterData.fridayPractice;
        var saturdayPractice = rosterData.saturdayPractice;


        if (weeklyRoster != null && weeklyRoster.id) {

            console.log('Going to update exsiting  roster ' + weeklyRoster.id + ' for doctorId ' + doctorId)
            const savedRoster = dataServices.updateWeeklyRoster(weeklyRoster.id, doctorId, mondayOff, tuesdayOff, wednesdayOff, thursdayOff, fridayOff, saturdayOff, sundayOff,
                sundayFromHour, sundayFromMin, sundayToHour, sundayToMin, sundayFromAmPm, sundayToAmPm,
                mondayFromHour, mondayFromMin, mondayToHour, mondayToMin, mondayFromAmPm, mondayToAmPm,
                tuesdayFromHour, tuesdayFromMin, tuesdayToHour, tuesdayToMin, tuesdayFromAmPm, tuesdayToAmPm,
                wednesdayFromHour, wednesdayFromMin, wednesdayToHour, wednesdayToMin, wednesdayFromAmPm, wednesdayToAmPm,
                thursdayFromHour, thursdayFromMin, thursdayToHour, thursdayToMin, thursdayFromAmPm, thursdayToAmPm,
                fridayFromHour, fridayFromMin, fridayToHour, fridayToMin, fridayFromAmPm, fridayToAmPm,
                saturdayFromHour, saturdayFromMin, saturdayToHour, saturdayToMin, saturdayFromAmPm, saturdayToAmPm,
                sundayPractice, mondayPractice, tuesdayPractice, wednesdayPractice, thursdayPractice, fridayPractice, saturdayPractice)
                .then((result) => {
                    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^Roster data updatd for the given doctor :' + doctorId)
                    console.log(result)
                    res.status(200).json({ data: result });
                })
                .catch(function (error) {
                    console.log('Error in WeeklyRoster addOrUpdate')
                    console.log(error)
                });

            //-- this is an update
        } else {

            console.log('Going to create a new roster  for doctorId ' + doctorId)

            const savedRoster = dataServices.createWeeklyRoster(doctorId, mondayOff, tuesdayOff, wednesdayOff, thursdayOff, fridayOff, saturdayOff, sundayOff,
                sundayFromHour, sundayFromMin, sundayToHour, sundayToMin, sundayFromAmPm, sundayToAmPm,
                mondayFromHour, mondayFromMin, mondayToHour, mondayToMin, mondayFromAmPm, mondayToAmPm,
                tuesdayFromHour, tuesdayFromMin, tuesdayToHour, tuesdayToMin, tuesdayFromAmPm, tuesdayToAmPm,
                wednesdayFromHour, wednesdayFromMin, wednesdayToHour, wednesdayToMin, wednesdayFromAmPm, wednesdayToAmPm,
                thursdayFromHour, thursdayFromMin, thursdayToHour, thursdayToMin, thursdayFromAmPm, thursdayToAmPm,
                fridayFromHour, fridayFromMin, fridayToHour, fridayToMin, fridayFromAmPm, fridayToAmPm,
                saturdayFromHour, saturdayFromMin, saturdayToHour, saturdayToMin, saturdayFromAmPm, saturdayToAmPm)
                .then((result) => {
                    console.log('=============+++++++====Roster data CREATED for  for the given doctor :' + doctorId)
                    console.log(result)
                    res.status(200).json({ data: result });
                })
                .catch(function (error) {
                    console.log('Error in WeeklyRoster addOrUpdate')
                    console.log(error)
                });;
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }

})



if (environment !== 'production') {
    
    console.log(`Development port is ${port}`); 

    app.listen(port, () => {
        console.log(`TZ RefConnect Services listening on port ${port} `);
    });
}
else {

    console.log(`Production port is ${port}`); 
    https
    .createServer({
        key: fs.readFileSync("./privatekey.pem"),
        cert: fs.readFileSync("./certificate.pem"),
        },
        app
    )
    .listen(port, () => {
        console.log("https TZ RefConnect server is runing on port 3000");
    });

}