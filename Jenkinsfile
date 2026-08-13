pipeline {
    agent any

    tools {
        nodejs 'NodeJS' // Make sure the name matches what you configure in Jenkins -> Tools
    }

    parameters {
        choice(name: 'ENVIRONMENT', choices: ['DEV', 'QA', 'DEMO', 'UAT', 'PROD'], description: 'Target environment')
        choice(name: 'TEST_SUITE', choices: ['ALL', 'SMOKE', 'REGRESSION', 'CRITICAL'], description: 'Test suite to run')
        booleanParam(name: 'NOTIFY_SLACK', defaultValue: true, description: 'Send Slack Notification?')
        booleanParam(name: 'NOTIFY_EMAIL', defaultValue: true, description: 'Send Email Notification?')
    }

    triggers {
        parameterizedCron('''
            # Run DEMO every 4 hours
            H */4 * * * %ENVIRONMENT=DEMO;TEST_SUITE=ALL
            
            # Run UAT every 5 hours
            H */5 * * * %ENVIRONMENT=UAT;TEST_SUITE=ALL
        ''')
    }

    environment {
        ENV = "${params.ENVIRONMENT}"
        
        // Credentials will be loaded automatically by Playwright via dotenv from the respective .env.${ENV} file
        
        // SLACK_WEBHOOK_URL = credentials('slack-webhook-url')
        SMTP_PASSWORD = credentials('5e0a0311-2944-4f7f-9de5-e84821b5e5c0')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                sh 'npx playwright install'
            }
        }

        stage('Validate Configuration') {
            steps {
                echo "Running API Tests against ${env.ENV} environment..."
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Run API Tests') {
            steps {
                script {
                    try {
                        // Clean previous allure results to ensure report only contains current execution data
                        sh 'rm -rf allure-results'
                        
                        def testCommand = "npm run test"
                        if (params.TEST_SUITE != 'ALL') {
                            testCommand = "npm run test:${params.TEST_SUITE.toLowerCase()}"
                        }
                        sh "${testCommand}"
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Generating Reports and Sending Notifications...'
            
            // Publish Allure Report to Jenkins (requires Allure Jenkins Plugin)
            allure([
                includeProperties: false,
                jdk: '',
                properties: [],
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']]
            ])
            
            // Generate standalone single-file HTML Allure report natively
            sh 'npx allure generate allure-results --clean --single-file -o allure-report'
            
            // Generate Management Summary
            sh 'npm run generate-summary'

            // Send Notifications
            script {
                if (params.NOTIFY_SLACK) {
                    sh 'npm run notify:slack'
                }
                
                if (params.NOTIFY_EMAIL) {
                    sh 'npm run notify:email'
                    
                    if (fileExists('email-content.html')) {
                        def emailSubject = readFile('email-subject.txt').trim()
                        def emailBody = readFile('email-content.html')
                        def emailTo = readFile('email-to.txt').trim()

                        emailext(
                            subject: emailSubject,
                            body: emailBody,
                            mimeType: 'text/html',
                            to: emailTo,
                            attachmentsPattern: 'allure-report/index.html'
                        )
                    }
                }
            }
            
            // Archive artifacts
            archiveArtifacts artifacts: 'summary.json, logs/*.log', allowEmptyArchive: true
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed! Check the reports for details.'
        }
    }
}
