# Exploit Data Analytics

A comprehensive data analysis and reporting web application that leverages machine learning and AI to provide deep insights from CSV data. Built with Next.js, React, and integrated with OpenAI's ChatGPT API for intelligent analysis.

## 🚀 Features

### Core Functionality
- **CSV Data Ingestion**: Upload and parse CSV files with automatic data type detection
- **Machine Learning Analysis**: Automated correlation analysis, trend detection, and clustering
- **AI-Powered Insights**: Integration with OpenAI's ChatGPT API for contextual analysis and recommendations
- **Interactive Visualizations**: Dynamic charts and graphs with smooth animations
- **Report Generation**: Export comprehensive reports in PDF and Excel formats
- **Statistical Analysis**: Comprehensive statistical summaries and data quality assessments

### Advanced Capabilities
- **Correlation Heatmaps**: Visual representation of variable relationships
- **Trend Analysis**: Automatic detection of increasing, decreasing, and stable patterns
- **Cluster Visualization**: Machine learning-based data grouping and visualization
- **Executive Summaries**: AI-generated business-focused insights
- **Data Quality Checks**: Automatic validation and missing data detection
- **Responsive Design**: Optimized for desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Visualizations**: Recharts with custom animations
- **AI Integration**: OpenAI API via Vercel AI SDK
- **Data Processing**: Custom CSV parser and statistical analysis
- **Machine Learning**: Custom correlation and clustering algorithms
- **File Handling**: React Dropzone for file uploads

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager
- OpenAI API key

## 🔧 Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd exploit-data-analytics
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Environment Setup**
   Create a \`.env.local\` file in the root directory:
   \`\`\`env
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to \`http://localhost:3000\`

## 📖 Usage Guide

### Getting Started

1. **Upload Data**: Drag and drop a CSV file or click to select from your computer
2. **Preview Data**: Review the data structure, column types, and initial AI insights
3. **Run Analysis**: Execute advanced machine learning analysis for deeper insights
4. **Explore Results**: Navigate through correlation analysis, trends, and clusters
5. **Generate Reports**: Create comprehensive PDF or Excel reports

### Data Requirements

- **File Format**: CSV files only
- **Size Limit**: Recommended under 10MB for optimal performance
- **Structure**: First row should contain column headers
- **Data Types**: Mix of numeric and categorical data works best

### Analysis Features

#### Correlation Analysis
- Identifies relationships between numeric variables
- Visual heatmap representation
- Filters significant correlations (|r| > 0.3)

#### Trend Detection
- Analyzes patterns in numeric data over time/sequence
- Classifies trends as increasing, decreasing, or stable
- Visual trend line representations

#### Clustering
- Groups similar data points using k-means algorithm
- Visualizes clusters in 2D scatter plots
- Provides cluster size and centroid information

#### AI Insights
- Initial data overview and quality assessment
- Detailed analysis interpretation
- Business-focused recommendations
- Executive summary generation

## 🎨 User Interface

### Navigation
- **Upload Data**: File upload interface with drag-and-drop support
- **Preview**: Data table with column type indicators and summary statistics
- **Analysis**: Tabbed interface for correlations, trends, clusters, and statistics
- **Reports**: Report generation and executive summary tools

### Visualizations
- **Correlation Heatmap**: Color-coded matrix showing variable relationships
- **Trend Charts**: Line graphs with animated rendering
- **Cluster Plots**: Scatter plots with color-coded groupings
- **Statistical Tables**: Comprehensive data summaries

## 🔌 API Integration

### OpenAI Integration
The application uses OpenAI's GPT models for:
- Initial data insights generation
- Detailed analysis interpretation
- Executive summary creation
- Business recommendation formulation

### Configuration
\`\`\`typescript
// AI SDK configuration
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

const { text } = await generateText({
  model: openai('gpt-4o-mini'),
  prompt: analysisPrompt,
  maxTokens: 500
})
\`\`\`

## 📊 Machine Learning Algorithms

### Correlation Analysis
- Pearson correlation coefficient calculation
- Statistical significance testing
- Multi-variable relationship mapping

### Trend Analysis
- Linear regression slope calculation
- Pattern classification algorithms
- Time series analysis techniques

### Clustering
- K-means clustering implementation
- Optimal cluster number determination
- Centroid calculation and visualization

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 🔒 Security Considerations

- API keys stored securely in environment variables
- Client-side data processing (no server-side data storage)
- HTTPS enforcement for production deployments
- Input validation and sanitization

## 🐛 Troubleshooting

### Common Issues

**File Upload Fails**
- Ensure file is in CSV format
- Check file size (recommended < 10MB)
- Verify CSV structure with proper headers

**AI Insights Not Generated**
- Verify OpenAI API key is correctly set
- Check API key permissions and billing status
- Ensure network connectivity

**Visualizations Not Rendering**
- Check browser compatibility (modern browsers required)
- Ensure JavaScript is enabled
- Try refreshing the page

**Analysis Takes Too Long**
- Large datasets may require more processing time
- Consider sampling data for initial analysis
- Check browser console for error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- Vercel for the AI SDK and deployment platform
- The React and Next.js communities
- shadcn/ui for the component library
- Recharts for visualization components

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Exploit Data Analytics** - Transforming data into actionable insights with the power of AI.
