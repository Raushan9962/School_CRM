const pool = require('./config/db');
const bcrypt = require('bcrypt');

async function createSuperAdmin() {
    try {
        // 1. Ensure 'Super Admin' role exists
        let roleResult = await pool.query(
            `INSERT INTO roles (name) VALUES ('Super Admin') ON CONFLICT (name) DO NOTHING RETURNING id`
        );
        let roleId;
        if (roleResult.rows.length > 0) {
            roleId = roleResult.rows[0].id;
        } else {
            const existing = await pool.query(`SELECT id FROM roles WHERE name = 'Super Admin'`);
            roleId = existing.rows[0].id;
        }

        // 2. Check if super admin already exists
        const existing = await pool.query(`SELECT id FROM users WHERE email = 'superadmin@vidyasetu.com'`);
        if (existing.rows.length > 0) {
            console.log('Super Admin already exists!');
            console.log('Email: superadmin@vidyasetu.com');
            console.log('Password: SuperAdmin@123');
            process.exit(0);
        }

        // 3. Create the Super Admin user
        const hashedPassword = await bcrypt.hash('SuperAdmin@123', 10);
        const image = 'https://api.dicebear.com/5.x/initials/svg?seed=SuperAdmin';

        const newUser = await pool.query(
            `INSERT INTO users (name, email, phone, password, role_id, image) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email`,
            ['Super Admin', 'superadmin@vidyasetu.com', '9999999999', hashedPassword, roleId, image]
        );

        console.log('✅ Super Admin created successfully!');
        console.log('-----------------------------------');
        console.log('Email:    superadmin@vidyasetu.com');
        console.log('Password: SuperAdmin@123');
        console.log('-----------------------------------');
        console.log('Please change the password after first login.');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating super admin:', error.message);
        process.exit(1);
    }
}

createSuperAdmin();
