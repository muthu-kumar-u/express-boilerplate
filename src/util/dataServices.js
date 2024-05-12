const { boolean } = require("yargs");
const db = require("../models");

const comm = db.comm;
const commmsg = db.commmsg
const weeklyroster = db.weeklyroster
const doctor = db.doctor
const adduser=db.users

const { Op } = require("sequelize");
const Doctor = require("../models/Doctor");
const Users = require("../models/Users");





async function getAllComm() {
    const allComm = await comm.findAll({ 
        limit: 50,
        order: [
          ['id', 'DESC']
        ], "raw": true });
    return allComm;
}

async function getAllProfiles() {
    const doctors = await doctor.findAll({ 
        limit: 50,
        order: [
          ['name', 'ASC']
        ], "raw": true });


    return doctors;
}

async function getMyOpenThreads(myId) {

    const allComm = await comm.findAll({ 
        limit: 50,
        order: [
          ['id', 'DESC']
        ],
        where: {
            status: '0',
          [Op.or]: [{ from_id: myId }, { to_id : myId}],
        }, "raw": true });
    return allComm;
}

async function getMyClosedThreads(myId) {

    const allComm = await comm.findAll({ 
        limit: 50,
        order: [
          ['id', 'DESC']
        ],
        where: {
            status: '1',
          [Op.or]: [{ from_id: myId }, { to_id : myId}],
        }, "raw": true });
    return allComm;
}


async function getAllCommFromTo(fromId, toId) {
    const commData = await comm.findAll({
        limit: 10,
        order: [
          ['id', 'DESC']
        ],
        where: {
            from_id: fromId, to_id : toId,
          [Op.or]: [{ status: '0' }, { status: '1' }],
        },
        "raw": true
    });
    return commData;
}

async function getOpenCommFromTo(fromId, toId) {
    const commData = await comm.findAll({
        limit: 10,
        order: [
          ['id', 'DESC']
        ],
        where: {
            from_id: fromId, to_id : toId, status: '0'
        },
        "raw": true
    });
    return commData;
}

async function getClosedCommFromTo(fromId, toId) {
    const commData = await chapter.findAll({
        limit: 10,
        order: [
          ['id', 'DESC']
        ],
        where: {
            from_id: fromId, to_id : toId, status: '1'
        },
        "raw": true
    });
    return commData;
}


async function getAllMsgsForComm(commId) {
    const msgData = await commmsg.findAll({
        order: [
            ['seq', 'ASC']
          ],
        where: { comm_id: commId },
        "raw": true
    });
    return msgData;
}

/*
async function getMyClosedThreads(myId) {

    const allComm = await comm.findAll({ 
        limit: 50,
        order: [
          ['id', 'DESC']
        ],
        where: {
            status: '1',
          [Op.or]: [{ from_id: myId }, { to_id : myId}],
        }, "raw": true });
    return allComm;
}
*/


//-- TODO - this needs to be changed
async function updateCommStatusToClosed(commId, status) {
    await comm.update({ status: status }, { where: { id : commId } });
}


async function AddUser(email,password){

    const add=await adduser.create({

        //name:name,
       // speciality:speciality,
        email:email,
        password:password,
       // ConformPassword:ConformPassword,
        
    }).then(async res=>{
        console.log("User Created successfully for add user "+ res);
    }).catch((error)=>{
        console.log("error in add user :"+error);
    })

    return add;

}








  
async function createComm(fromId, fromName, toId, toName, message) {

    console.log('Going to create  new commthread - brand new');

    var new_comm_msg = {}
    const new_thread = await comm.create({
        from_id: fromId,
        from_dr: fromName,
        to_id: toId,
        to_dr: toName,
        status: '0',
        first_msg: message,
        last_msg_time: new Date()

    }).then(async res => {
        console.log(res)
        console.log('Created new commthread with the id as ' + res.id);
        console.log('Now Going to create  new commthread - brandnew for commId ' +  res.id);

        new_comm_msg =  await commmsg.create({
            comm_id: res.id,
            from_id: fromId,
            seq : 1,
            is_reply: '0',
            msg: message,
        }).then(res2 => {
            console.log(res2)
            console.log('Created new comm_msg with the id as ' + res2.id)
            console.log('Going to return new comm_msg')
            return res2;
        }).catch((error) => {
            console.error('Failed to create a new commmsg record : ', error);
        });

    }).catch((error) => {
        console.error('Failed to create a new comm record : ', error);
    });

    return new_comm_msg;
    
}

async function createCommMsg(commId, fromId, message) {

    var latestSeq = 1;
    var new_comm_msg = {};

    console.log('Adding a message - Fetching the original comm identifier for commId ' + commId)
    const mainCommThread = await comm.findOne({
        where : { id : commId }
    }).then(async ref => {
        const originalFromId = ref.from_id;
        var reply = '0'

        console.log('Original From Id from comm table is ' + originalFromId )
        console.log(ref)
        console.log('From Id in this message is ' + fromId + ' We are checking if this is a reply')
        if (fromId == originalFromId) {
            console.log('Not a reply - It is the initiator sending additional infomation')
        } else {
            console.log('This is a reply...!') 
            reply = '1'
        }

        const lastMsg = await commmsg.findOne({
            where : { comm_id : commId }, // find records which is_current = 0;
            order : [  ['id', 'DESC'] ] // order by desc will make highest to the first record
        }).then(async ref => {
            if(ref) { 
                latestSeq = ref.seq + 1
            } else {
                console.log('Could not find any entries in commMsg for commId ' + commId)
            }
    
            console.log('Using seq values as '  + latestSeq)
    
            new_comm_msg = await commmsg.create({
                comm_id: commId,
                from_id: fromId,
                seq : latestSeq,
                is_reply: reply,
                msg: message,
            }).then(res => {
                console.log('Successfully added the message !~!!!')
                console.log(res)
                return res;
            }).catch((error) => {
                console.error('Failed to create a new comm record : ', error);
            });
        });

    });

    return new_comm_msg;
}
   

async function createWeeklyRoster(doctorId, mondayOff, tuesdayOff, wednesdayOff, thursdayOff, fridayOff, saturdayDayOff, sundayOff,
            sundayFromHour, sundayFromMin, sundayToHour, sundayToMin, sundayFromAmPm, sundayToAmPm,
            mondayFromHour, mondayFromMin, mondayToHour, mondayToMin, mondayFromAmPm, mondayToAmPm,
            tuesdayFromHour, tuesdayFromMin, tuesdayToHour, tuesdayToMin, tuesdayFromAmPm, tuesdayToAmPm,
            wednesdayFromHour, wednesdayFromMin, wednesdayToHour, wednesdayToMin, wednesdayFromAmPm, wednesdayToAmPm,
            thursdayFromHour, thursdayFromMin, thursdayToHour, thursdayToMin, thursdayFromAmPm, thursdayToAmPm,
            fridayFromHour, fridayFromMin, fridayToHour, fridayToMin, fridayFromAmPm, fridayToAmPm,
            saturdayFromHour, saturdayFromMin, saturdayToHour, saturdayToMin, saturdayFromAmPm, saturdayToAmPm) {

                var new_roster = {};

                new_roster = await weeklyroster.create({
                    doctor_id : doctorId,
                    sunday_off : sundayOff,
                    monday_off : mondayOff,
                    tuesday_off : tuesdayOff,
                    wednesday_off : wednesdayOff,
                    thursday_off : thursdayOff,
                    friday_off : fridayOff,
                    saturday_off : saturdayDayOff,

                    sunday_from_hour:sundayFromHour,
                    sunday_from_min: sundayFromMin,
                    sunday_to_hour: sundayToHour,
                    sunday_to_min: sundayToMin,
                    sunday_from_am_pm: sundayFromAmPm,
                    sunday_to_am_pm: sundayToAmPm,

                    monday_from_hour: mondayFromHour,
                    monday_from_min: mondayFromMin,
                    monday_to_hour: mondayToHour,
                    monday_to_min: mondayToMin,
                    monday_from_am_pm: mondayFromAmPm,
                    monday_to_am_pm: mondayToAmPm,

                    tuesday_from_hour:tuesdayFromHour,
                    tuesday_from_min: tuesdayFromMin,
                    tuesday_to_hour: tuesdayToHour,
                    tuesday_to_min: tuesdayToMin,
                    tuesday_from_am_pm: tuesdayFromAmPm,
                    tuesday_to_am_pm: tuesdayToAmPm,

                    wednesday_from_hour: wednesdayFromHour,
                    wednesday_from_min: wednesdayFromMin,
                    wednesday_to_hour: wednesdayToHour,
                    wednesday_to_min: wednesdayToMin,
                    wednesday_from_am_pm: wednesdayFromAmPm,
                    wednesday_to_am_pm: wednesdayToAmPm,

                    thursday_from_hour:thursdayFromHour,
                    thursday_from_min: thursdayFromMin,
                    thursday_to_hour: thursdayToHour,
                    thursday_to_min: thursdayToMin,
                    thursday_from_am_pm: thursdayFromAmPm,
                    thursday_to_am_pm: thursdayToAmPm,

                    friday_from_hour:fridayFromHour,
                    friday_from_min: fridayFromMin,
                    friday_to_hour: fridayToHour,
                    friday_to_min: fridayToMin,
                    friday_from_am_pm: fridayFromAmPm,
                    friday_to_am_pm: fridayToAmPm,

                    saturday_from_hour:saturdayFromHour,
                    saturday_from_min: saturdayFromMin,
                    saturday_to_hour: saturdayToHour,
                    saturday_to_min: saturdayToMin,
                    saturday_from_am_pm: saturdayFromAmPm,
                    saturday_to_am_pm: saturdayToAmPm

                }).then(res => {
                    console.log('Successfully added the weekly roster !~!!!')
                    console.log(res)
                    return res;
                }).catch((error) => {
                    console.error('Failed to create a new weekly roster record : ', error);
                });

                return new_roster;

}


async function updateWeeklyRoster(rosterId, doctorId, mondayOff, tuesdayOff, wednesdayOff, thursdayOff, fridayOff, saturdayDayOff, sundayOff,
    sundayFromHour, sundayFromMin, sundayToHour, sundayToMin, sundayFromAmPm, sundayToAmPm,
    mondayFromHour, mondayFromMin, mondayToHour, mondayToMin, mondayFromAmPm, mondayToAmPm,
    tuesdayFromHour, tuesdayFromMin, tuesdayToHour, tuesdayToMin, tuesdayFromAmPm, tuesdayToAmPm,
    wednesdayFromHour, wednesdayFromMin, wednesdayToHour, wednesdayToMin, wednesdayFromAmPm, wednesdayToAmPm,
    thursdayFromHour, thursdayFromMin, thursdayToHour, thursdayToMin, thursdayFromAmPm, thursdayToAmPm,
    fridayFromHour, fridayFromMin, fridayToHour, fridayToMin, fridayFromAmPm, fridayToAmPm,
    saturdayFromHour, saturdayFromMin, saturdayToHour, saturdayToMin, saturdayFromAmPm, saturdayToAmPm,
    sundayPractice, mondayPractice, tuesdayPractice, wednesdayPractice, thursdayPractice, fridayPractice, saturdayPractice) {


        var updated_roster = {};

        updated_roster =await weeklyroster.update({
                    sunday_off : sundayOff,
                    monday_off : mondayOff,
                    tuesday_off : tuesdayOff,
                    wednesday_off : wednesdayOff,
                    thursday_off : thursdayOff,
                    friday_off : fridayOff,
                    saturday_off : saturdayDayOff,

                    sunday_from_hour:sundayFromHour,
                    sunday_from_min: sundayFromMin,
                    sunday_to_hour: sundayToHour,
                    sunday_to_min: sundayToMin,
                    sunday_from_am_pm: sundayFromAmPm,
                    sunday_to_am_pm: sundayToAmPm,

                    monday_from_hour: mondayFromHour,
                    monday_from_min: mondayFromMin,
                    monday_to_hour: mondayToHour,
                    monday_to_min: mondayToMin,
                    monday_from_am_pm: mondayFromAmPm,
                    monday_to_am_pm: mondayToAmPm,

                    tuesday_from_hour:tuesdayFromHour,
                    tuesday_from_min: tuesdayFromMin,
                    tuesday_to_hour: tuesdayToHour,
                    tuesday_to_min: tuesdayToMin,
                    tuesday_from_am_pm: tuesdayFromAmPm,
                    tuesday_to_am_pm: tuesdayToAmPm,

                    wednesday_from_hour: wednesdayFromHour,
                    wednesday_from_min: wednesdayFromMin,
                    wednesday_to_hour: wednesdayToHour,
                    wednesday_to_min: wednesdayToMin,
                    wednesday_from_am_pm: wednesdayFromAmPm,
                    wednesday_to_am_pm: wednesdayToAmPm,

                    thursday_from_hour:thursdayFromHour,
                    thursday_from_min: thursdayFromMin,
                    thursday_to_hour: thursdayToHour,
                    thursday_to_min: thursdayToMin,
                    thursday_from_am_pm: thursdayFromAmPm,
                    thursday_to_am_pm: thursdayToAmPm,

                    friday_from_hour:fridayFromHour,
                    friday_from_min: fridayFromMin,
                    friday_to_hour: fridayToHour,
                    friday_to_min: fridayToMin,
                    friday_from_am_pm: fridayFromAmPm,
                    friday_to_am_pm: fridayToAmPm,

                    saturday_from_hour:saturdayFromHour,
                    saturday_from_min: saturdayFromMin,
                    saturday_to_hour: saturdayToHour,
                    saturday_to_min: saturdayToMin,
                    saturday_from_am_pm: saturdayFromAmPm,
                    saturday_to_am_pm: saturdayToAmPm,

                    sunday_practice: sundayPractice,
                    monday_practice: mondayPractice,
                    tuesday_practice: tuesdayPractice,
                    wednesday_practice: wednesdayPractice,
                    thursday_practice: thursdayPractice,
                    friday_practice: fridayPractice,
                    saturday_practice: saturdayPractice

          }, { where: { id: rosterId, doctor_id: doctorId } })
        .then(res => {
            console.log('Successfully UPDATED the weekly roster !~!!!')
            console.log(res)
            return res;
        }).catch((error) => {
            console.error('Failed to create a new weekly roster record : ', error);
        });

        return updated_roster;
         

}

async function getWeeklyRosterForDoctor(doctorId) {

    const weeklyRosterData = await weeklyroster.findOne({
        where: {
            doctor_id: doctorId
        },
        "raw": true
    });
    return weeklyRosterData;
}

async function getCommById(commId) {
    const mainCommThread = await comm.findOne({
        where : { id : commId },
    "raw": true
    });
    return mainCommThread;
}




async function getDoctorProfile(doctorId) {
    const doctorData = await doctor.findOne({
        where: {
            id: doctorId
        },
        "raw": true
    });
    return doctorData;

}

async function getDoctorProfileByEmail(email) {
    const doctorData = await doctor.findOne({
        where: {
            email: email
        },
        "raw": true
    });
    return doctorData;

}

async function updateDoctorProfile(doctorId, thisName, thisPhone, thisPractice, thisSpecialization, thisStatusMsg) {

    var updated_dr_details = {};

    updated_dr_details =await doctor.update({
        name : thisName,
        phone: thisPhone,
        practice: thisPractice,
        specialization: thisSpecialization,
        status: thisStatusMsg
    }, { where: { id: doctorId } })
    .then(res => {
        console.log('Successfully updated the doctor profile !~!!!')
        console.log(res)
        return res;
    }).catch((error) => {
        console.error('Oh nooo did not update dr profile details : ', error);
    });

    return updated_dr_details;
}


async function addusertoDoctor(thisName,thisSpecialization,email){

    var create_user_details={};

    create_user_details=await doctor.create({
        //id:doctorId,
       name:thisName,
        speciality:thisSpecialization,
        email:email,
        //password:password,
    }).then(res=>{
        console.log("User Created successfully in doctor "+ res);
    }).catch((error)=>{
        console.log("error in add user :"+error);
    })

    return create_user_details;
}

async function updateOnlineStatus(doctorId, currentOnlineStatus) {
    var updated_dr_details = {};

    updated_dr_details =await doctor.update({
        userOnlineStatus : currentOnlineStatus
    }, { where: { id: doctorId } })
    .then(res => {
        console.log('Successfully updated the doctor online status !~!!!')
        console.log(res)
        return res;
    }).catch((error) => {
        console.error('Oh nooo could not update dr onlinr details : ', error);
    });

    return updated_dr_details;
}

async function updateClosedUserDetails(commId, doctorId, firstClose) {

    console.log('Going to close Comm message for id ' + commId + ' and doctorId ' + doctorId + ' and firstClose ' + firstClose)
    //var firstClose = true;
    /*
    const mainCommThread = await comm.findOne({
        where : { id : commId }
    }).then(async ref => {
        console.log('First closed by value is ' + ref.closed_by_1)
        if (ref.closed_by_1) firstClose = false;
        else firstClose = true;
    });
    */
    if (firstClose) {
        await comm.update({ closed_by_1: doctorId, closed_by_1_date: new Date() }, { where: { id : commId } });
    } else {
        await comm.update({ closed_by_2: doctorId, closed_by_2_date: new Date, status: '1' }, { where: { id : commId } });
    }

    return 'success';
}




module.exports = {
    getAllComm, getAllCommFromTo, getOpenCommFromTo, getClosedCommFromTo, getAllMsgsForComm,
    updateCommStatusToClosed,  createComm,  createCommMsg, getMyOpenThreads, getMyClosedThreads,
    createWeeklyRoster, updateWeeklyRoster, getWeeklyRosterForDoctor, getDoctorProfile, updateDoctorProfile,
    updateOnlineStatus, updateClosedUserDetails, getAllProfiles, getDoctorProfileByEmail, getCommById,AddUser,
    addusertoDoctor,
}