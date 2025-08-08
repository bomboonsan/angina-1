-- Create agent table
CREATE TABLE IF NOT EXISTS agent (
    id INT AUTO_INCREMENT PRIMARY KEY,
    agent_code VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add index for better performance
CREATE INDEX idx_agent_code ON agent(agent_code);
CREATE INDEX idx_created_at ON agent(created_at);
