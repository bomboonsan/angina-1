#!/bin/bash

# Database setup script for agent table
# Make sure MariaDB is running and you have access

echo "Setting up agent table in MariaDB..."

# Connect to MariaDB and create the table
mariadb -u angina -p angina < database/create_agent_table.sql

if [ $? -eq 0 ]; then
    echo "✅ Agent table created successfully!"
else
    echo "❌ Error creating agent table. Please check your database connection."
fi

echo "📋 To manually create the table, run:"
echo "mariadb -u angina -p angina < database/create_agent_table.sql"
