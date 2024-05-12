module.exports = (sequelize, DataTypes) => {

    const WeeklyRoster = sequelize.define("weeklyroster", {

            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            doctor_id: DataTypes.INTEGER,

            sunday_off : DataTypes.STRING,
            monday_off : DataTypes.STRING,
            tuesday_off : DataTypes.STRING,
            wednesday_off : DataTypes.STRING,
            thursday_off : DataTypes.STRING,
            friday_off : DataTypes.STRING,
            saturday_off : DataTypes.STRING,

            sunday_from_hour : DataTypes.INTEGER,
            monday_from_hour : DataTypes.INTEGER,
            tuesday_from_hour : DataTypes.INTEGER,
            wednesday_from_hour : DataTypes.INTEGER,
            thursday_from_hour : DataTypes.INTEGER,
            friday_from_hour : DataTypes.INTEGER,
            saturday_from_hour : DataTypes.INTEGER,

            sunday_to_hour : DataTypes.INTEGER,
            monday_to_hour : DataTypes.INTEGER,
            tuesday_to_hour : DataTypes.INTEGER,
            wednesday_to_hour : DataTypes.INTEGER,
            thursday_to_hour : DataTypes.INTEGER,
            friday_to_hour : DataTypes.INTEGER,
            saturday_to_hour : DataTypes.INTEGER,

            sunday_from_min : DataTypes.INTEGER,
            monday_from_min : DataTypes.INTEGER,
            tuesday_from_min : DataTypes.INTEGER,
            wednesday_from_min : DataTypes.INTEGER,
            thursday_from_min : DataTypes.INTEGER,
            friday_from_min : DataTypes.INTEGER,
            saturday_from_min : DataTypes.INTEGER,

            sunday_to_min : DataTypes.INTEGER,
            monday_to_min : DataTypes.INTEGER,
            tuesday_to_min : DataTypes.INTEGER,
            wednesday_to_min : DataTypes.INTEGER,
            thursday_to_min : DataTypes.INTEGER,
            friday_to_min : DataTypes.INTEGER,
            saturday_to_min : DataTypes.INTEGER,

            sunday_from_am_pm : DataTypes.STRING,
            monday_from_am_pm : DataTypes.STRING,
            tuesday_from_am_pm : DataTypes.STRING,
            wednesday_from_am_pm : DataTypes.STRING,
            thursday_from_am_pm : DataTypes.STRING,
            friday_from_am_pm : DataTypes.STRING,
            saturday_from_am_pm : DataTypes.STRING,

            sunday_to_am_pm : DataTypes.STRING,
            monday_to_am_pm : DataTypes.STRING,
            tuesday_to_am_pm : DataTypes.STRING,
            wednesday_to_am_pm : DataTypes.STRING,
            thursday_to_am_pm : DataTypes.STRING,
            friday_to_am_pm : DataTypes.STRING,
            saturday_to_am_pm : DataTypes.STRING,

            sunday_practice : DataTypes.STRING,
            monday_practice : DataTypes.STRING,
            tuesday_practice : DataTypes.STRING,
            wednesday_practice : DataTypes.STRING,
            thursday_practice : DataTypes.STRING,
            friday_practice : DataTypes.STRING,
            saturday_practice : DataTypes.STRING,

           
        },
        {
            sequelize,
            tableName: 'weekly_roster',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true
        }

    );

    return WeeklyRoster;
}