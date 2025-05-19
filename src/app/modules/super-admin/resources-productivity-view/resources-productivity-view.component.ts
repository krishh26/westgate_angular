import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { default as Annotation } from 'chartjs-plugin-annotation';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectManagerService } from 'src/app/services/project-manager/project-manager.service';
import { SuperadminService } from 'src/app/services/super-admin/superadmin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resources-productivity-view',
  templateUrl: './resources-productivity-view.component.html',
  styleUrls: ['./resources-productivity-view.component.scss']
})
export class ResourcesProductivityViewComponent implements OnInit, OnDestroy {

  showLoader: boolean = false;
  displayedUsers: any[] = [];
  loginUser: any;
  selectedUserIds: string[] = [];
  userList: any = [];
  showAll = false;

  // Task details display
  selectedTaskDetails: any[] = [];
  selectedUser: string = '';
  selectedDate: string = '';
  showTaskDetails: boolean = false;

  // Tasks filtered by status display
  tasksByStatus: any[] = [];
  statusFilterTitle: string = '';

  public lineChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{
      label: 'Hours',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 1
    }]
  };

  public interactiveChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Dataset 1',
        data: this.generateRandomData(),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: this.generateRandomData(),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }
    ]
  };

  public lineChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Resource Productivity'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  public interactiveChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Interactive Chart'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 100
      }
    }
  };

  public lineChartType: ChartType = 'bar' as const;
  private chart2!: Chart;

  // User Hours Chart Data
  public userHoursChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{
      label: 'Total Hours',
      data: [],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  // User Hours Chart Options
  public userHoursChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',  // Horizontal bar chart
    plugins: {
      title: {
        display: true,
        text: 'Total Tasks by User',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const taskCount = context.raw as number;
            return `Total Tasks: ${taskCount}`;
          }
        }
      },
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Tasks'
        }
      },
      y: {
        title: {
          display: true,
          text: 'User'
        }
      }
    }
  };

  startDate: string = '';
  endDate: string = '';

  // Store full API response for accessing task details
  private taskGraphData: any = null;

  constructor(
    private projectManagerService: ProjectManagerService,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder,
    private superadminService: SuperadminService
  ) {
    this.loginUser = this.localStorageService.getLogger();
    Chart.register(Annotation);
  }

  ngOnInit(): void {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    this.startDate = todayStr;
    this.endDate = todayStr;
    this.getUserAllList();
    this.getTaskGraphData();
  }

  onDateChange() {
    if (this.startDate && this.endDate) {
      // Clear any task status view
      this.clearTaskStatusView();

      // Also clear task details from chart clicks
      this.showTaskDetails = false;
      this.selectedTaskDetails = [];

      this.getTaskGraphData();
    }
  }

  formatDate(dateString: string, fullFormat = true): string {
    // Create a date object with a specific time to avoid timezone issues
    const date = new Date(dateString + 'T00:00:00');

    // Format date to display as "dd-MM" or "dd-MM-yyyy" format
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    if (fullFormat) {
      return `${day}-${month}-${year}`;
    } else {
      // Shorter format for many dates
      return `${day}/${month}`;
    }
  }

  // Helper method to generate dates between start and end
  getDatesInRange(startDate: string, endDate: string): string[] {
    const dateArray = [];

    // Create dates using the YYYY-MM-DD format directly to avoid timezone issues
    // This avoids the timezone offset problem by treating dates as local midnight
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');

    // Clone the start date to avoid modifying it
    let currentDate = new Date(start);

    // Loop until we reach the end date (inclusive)
    while (currentDate <= end) {
      // Format as YYYY-MM-DD to avoid timezone issues
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      dateArray.push(`${year}-${month}-${day}`);

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  }

  getTaskGraphData() {
    this.showLoader = true;
    this.showTaskDetails = false;
    this.selectedTaskDetails = [];

    // Ensure dates are in YYYY-MM-DD format for API
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    const params: any = {
      startDate: formattedStartDate,
      endDate: formattedEndDate
    };

    // Add userIds to params if users are selected
    if (this.selectedUserIds.length > 0) {
      const userIdsString = this.selectedUserIds.join(',');
      params.userIds = userIdsString;
      console.log(`Sending API request with userIds: ${userIdsString}`);
    }

    this.superadminService.getTaskGraph(params).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status === true) {
          // console.log('API Response data structure:', response.data);

          // Store full response for later use
          this.taskGraphData = response.data;

          // Get all dates in the selected range for chart labels
          const allDatesInRange = this.getDatesInRange(formattedStartDate, formattedEndDate);
          const useShortFormat = allDatesInRange.length > 10;
          const dateLabels = allDatesInRange.map(date => this.formatDate(date, !useShortFormat));

          // Build a map of user IDs to names from userList
          const userNameMap = new Map<string, string>();
          this.userList.forEach((user: any) => {
            if (user._id) {
              userNameMap.set(user._id, user.userName || 'Unknown User');
            }
          });

          // Create a date range string for the chart title
          const dateRangeText = `${this.formatDate(formattedStartDate)} to ${this.formatDate(formattedEndDate)}`;

          // Generate colors for users
          const userColors = [
            { bg: 'rgba(75, 192, 192, 0.6)', border: 'rgb(75, 192, 192)' },
            { bg: 'rgba(255, 99, 132, 0.6)', border: 'rgb(255, 99, 132)' },
            { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgb(54, 162, 235)' },
            { bg: 'rgba(255, 206, 86, 0.6)', border: 'rgb(255, 206, 86)' },
            { bg: 'rgba(153, 102, 255, 0.6)', border: 'rgb(153, 102, 255)' },
            { bg: 'rgba(255, 159, 64, 0.6)', border: 'rgb(255, 159, 64)' }
          ];

          if (response.data && this.selectedUserIds.length > 0) {
            console.log('Processing data for selected users');

            // Maps to track user data
            const userNamesByIds = new Map<string, string>();
            const userDailyData = new Map<string, Map<string, number>>();

            // First, initialize the daily data structure for all selected users and dates
            this.selectedUserIds.forEach(userId => {
              userDailyData.set(userId, new Map<string, number>());

              // Initialize all dates to 0 hours
              allDatesInRange.forEach(date => {
                userDailyData.get(userId)?.set(date, 0);
              });
            });

            // Process byUser data if available
            if (response.data.byUser && Array.isArray(response.data.byUser)) {
              response.data.byUser.forEach((userData: any) => {
                if (userData.user && userData.user.id) {
                  const userId = userData.user.id;
                  userNamesByIds.set(userId, userData.user.name || 'Unknown');

                  // Store total hours - we'll use this as fallback if we don't have daily data
                  if (this.selectedUserIds.includes(userId)) {
                    console.log(`Found user data for ${userData.user.name} (${userId}): ${userData.totalHours} hours`);
                  }
                }
              });
            }

            // Process byDate data to extract per-user daily information
            if (response.data.byDate && Array.isArray(response.data.byDate)) {
              response.data.byDate.forEach((dateData: any) => {
                if (dateData.date) {
                  const dateKey = dateData.date.split('T')[0];

                  // Process user data for this date if available
                  if (dateData.users && Array.isArray(dateData.users)) {
                    dateData.users.forEach((userOnDate: any) => {
                      // Extract user ID - could be in different formats
                      let userId;

                      if (userOnDate.user) {
                        // If user object is nested
                        userId = userOnDate.user.id;

                        if (userId && this.selectedUserIds.includes(userId)) {
                          const userName = userOnDate.user.name || 'Unknown';
                          userNamesByIds.set(userId, userName);

                          // Store hours for this user on this date
                          const hours = userOnDate.totalHours || 0;
                          userDailyData.get(userId)?.set(dateKey, hours);

                          console.log(`User ${userName} (${userId}) has ${hours} hours on ${dateKey}`);
                        }
                      } else {
                        // If user ID is directly available
                        userId = userOnDate._id || userOnDate.userId || userOnDate.id;

                        if (userId && this.selectedUserIds.includes(userId)) {
                          // Store hours for this user on this date
                          const hours = userOnDate.totalHours || userOnDate.hours || 0;
                          userDailyData.get(userId)?.set(dateKey, hours);

                          console.log(`User ${userId} has ${hours} hours on ${dateKey}`);
                        }
                      }
                    });
                  }
                }
              });
            }

            // Create datasets for each selected user
            const userDatasets: any[] = [];
            this.selectedUserIds.forEach((userId, index) => {
              // Get name from various sources
              const userName = userNamesByIds.get(userId) || userNameMap.get(userId) || userId;
              const color = userColors[index % userColors.length];

              // Get daily data for this user
              const userDateMap = userDailyData.get(userId);
              const dailyData = allDatesInRange.map(date => userDateMap?.get(date) || 0);

              // Check if we have any non-zero values
              const hasData = dailyData.some(value => value > 0);

              // If no daily data, use a small placeholder value to make bar visible
              const chartData = hasData ? dailyData : dailyData.map(() => 0.1);

              userDatasets.push({
                label: userName,
                data: chartData,
                backgroundColor: color.bg,
                borderColor: color.border,
                borderWidth: 1,
                borderRadius: 4
              });

              // console.log(`Created dataset for ${userName} with ${dailyData.length} date values`);
            });

            // Update chart data
            this.lineChartData.labels = dateLabels;
            this.lineChartData.datasets = userDatasets;

            // Update chart options for date-based view
            this.lineChartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: `User Hours by Date (${dateRangeText})`,
                  font: {
                    size: 16
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleFont: {
                    size: 13
                  },
                  bodyFont: {
                    size: 12
                  },
                  padding: 10,
                  callbacks: {
                    title: (tooltipItems) => {
                      return `Date: ${tooltipItems[0].label}`;
                    },
                    label: (context) => {
                      const userName = context.dataset.label || '';
                      const hoursValue = context.raw as number;
                      const displayHours = hoursValue > 0.1 ? hoursValue.toFixed(1) : '0';
                      return `${userName}: ${displayHours} hours`;
                    }
                  }
                },
                legend: {
                  display: true,
                  position: 'top'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Hours',
                    font: {
                      weight: 'bold'
                    }
                  },
                  ticks: {
                    precision: 1
                  },
                  stacked: false
                },
                x: {
                  title: {
                    display: true,
                    text: 'Date',
                    font: {
                      weight: 'bold'
                    }
                  },
                  ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    font: {
                      size: 10
                    }
                  }
                }
              }
            };
          } else {
            // Fallback to daily hours chart if no users selected

            // Create a map to store hours by date
            const dateHoursMap = new Map<string, number>();

            // Process byDate data to get hours for each date
            if (response.data.byDate && Array.isArray(response.data.byDate)) {
              response.data.byDate.forEach((dateData: any) => {
                if (dateData.date) {
                  const dateKey = dateData.date.split('T')[0];
                  dateHoursMap.set(dateKey, dateData.totalHours || 0);
                }
              });
            }

            // Create the dataset with hours for each date in the range
            const hoursByDate = allDatesInRange.map(date => dateHoursMap.get(date) || 0);

            // Update chart data
            this.lineChartData.labels = dateLabels;
            this.lineChartData.datasets = [{
              label: 'Total Hours',
              data: hoursByDate,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 1,
              borderRadius: 4
            }];

            this.lineChartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: `Daily Hours (${dateRangeText})`,
                  font: {
                    size: 16
                  }
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const hours = context.raw as number;
                      return `Hours: ${hours.toFixed(1)}`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Hours',
                    font: {
                      weight: 'bold'
                    }
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Date',
                    font: {
                      weight: 'bold'
                    }
                  },
                  ticks: {
                    maxRotation: 45,
                    minRotation: 45
                  }
                }
              }
            };
          }

          // Update the chart
          const canvas1 = document.getElementById('productivityChart') as HTMLCanvasElement;
          const existingChart1 = Chart.getChart(canvas1);
          if (existingChart1) {
            existingChart1.destroy();
          }

          // Determine the minimum width based on the number of data points
          const minWidth = Math.max(800, this.lineChartData.labels.length * 40);

          // Update the containing div's width
          const chartContainer = canvas1.parentElement;
          if (chartContainer) {
            chartContainer.style.minWidth = `${minWidth}px`;
          }

          const chart1 = new Chart(canvas1, {
            type: 'bar',
            data: this.lineChartData,
            options: {
              ...this.lineChartOptions,
              onClick: (event, elements) => {
                if (elements && elements.length > 0) {
                  const clickedElement = elements[0];
                  const datasetIndex = clickedElement.datasetIndex;
                  const index = clickedElement.index;

                  // Get the date that was clicked
                  const dateLabel = this.lineChartData.labels?.[index];
                  if (!dateLabel) return;

                  // Get the date in YYYY-MM-DD format for filtering
                  const formattedDate = this.convertLabelToDate(dateLabel.toString());
                  if (!formattedDate) {
                    console.error('Could not convert date label to date string:', dateLabel);
                    return;
                  }

                  // Get the user that was clicked
                  const userName = this.lineChartData.datasets[datasetIndex].label || '';
                  const userId = this.findUserIdByName(userName);

                  if (!userId) {
                    console.error('Could not find user ID for user:', userName);
                    return;
                  }

                  console.log(`Showing task details for ${userName} (${userId}) on ${formattedDate}`);
                  this.showTaskDetailsForUserAndDate(userId, formattedDate);
                }
              }
            }
          });
        } else {
          this.notificationService.showError(response?.message || 'Failed to fetch task graph data');
        }
      },
      (error) => {
        this.showLoader = false;
        this.notificationService.showError('Failed to fetch task graph data');
      }
    );

    // Create the user hours chart
    this.createUserHoursChart();
  }

  // Create the user hours chart showing total hours per user
  createUserHoursChart() {
    // Calculate total hours per user from the API response
    const userHours: Map<string, number> = new Map();

    // console.log('Creating user hours chart with userList length:', this.userList.length);

    // Make sure we have valid user data
    if (!this.userList || this.userList.length === 0) {
      console.log('No user data available for chart');
      return;
    }

    this.userList.forEach((user: any) => {
      if (user.userName) {
        // Use taskcount as a proxy for hours, ensure it's at least 1 for visibility
        const count = user.taskcount !== undefined ? Math.max(user.taskcount, 1) : 1;
        userHours.set(user.userName, count);
        // console.log(`User ${user.userName} has ${count} tasks`);
      }
    });

    // Sort users by hours (descending)
    const sortedUsers = Array.from(userHours.entries())
      .sort((a, b) => b[1] - a[1]);

    // Get top 15 users by hours (or all if less than 15)
    const topUsers = sortedUsers.slice(0, 15);

    if (topUsers.length === 0) {
      console.log('No user data after filtering');
      return;
    }

    console.log('Prepared data for chart:', topUsers);

    // Update chart data
    this.userHoursChartData.labels = topUsers.map(([userName]) => userName);
    this.userHoursChartData.datasets[0].data = topUsers.map(([_, hours]) => hours);

    // Create color gradient based on hours
    const maxHours = Math.max(...this.userHoursChartData.datasets[0].data as number[]);

    // Generate background colors based on value (higher value = darker color)
    this.userHoursChartData.datasets[0].backgroundColor = this.userHoursChartData.datasets[0].data.map((hours) => {
      const intensity = Math.min(0.3 + 0.7 * ((hours as number) / maxHours), 1);
      return `rgba(54, 162, 235, ${intensity})`;
    });

    // Update user hours chart
    const canvasUserHours = document.getElementById('userHoursChart') as HTMLCanvasElement;
    if (!canvasUserHours) {
      console.error('Cannot find userHoursChart canvas element');
      return;
    }

    const existingUserHoursChart = Chart.getChart(canvasUserHours);
    if (existingUserHoursChart) {
      existingUserHoursChart.destroy();
    }

    // Create new chart
    new Chart(canvasUserHours, {
      type: 'bar',
      data: this.userHoursChartData,
      options: this.userHoursChartOptions
    });
  }

  toggleView() {
    this.showAll = !this.showAll;
    this.displayedUsers = this.showAll
      ? this.userList
      : this.userList.slice(0, 7);
  }


  toggleUserSelection(userId: string): void {
    if (!userId) return;

    // Clear any task status view that might be displayed
    this.clearTaskStatusView();

    const index = this.selectedUserIds.indexOf(userId);
    if (index > -1) {
      this.selectedUserIds.splice(index, 1);
    } else {
      this.selectedUserIds.push(userId);
    }

    // Refresh the chart with the selected users
    this.getTaskGraphData();
  }

  // Clear the tasks by status view
  clearTaskStatusView(): void {
    this.tasksByStatus = [];
    this.statusFilterTitle = '';
  }

  getUserAllList(priorityType: string = '', type: string = '') {
    this.showLoader = true;
    const taskcount = true;
    const taskPage = 1;

    this.projectManagerService.getUserallList(taskcount, taskPage, priorityType, type).subscribe(
      (response) => {
        if (response?.status === true) {
          this.userList = response?.data?.filter(
            (user: any) => user?.role !== 'SupplierAdmin'
          );
          this.displayedUsers = this.userList.slice(0, 7);
          this.showLoader = false;
        } else {
          this.notificationService.showError(response?.message);
        }
      },
      (error) => {
        this.showLoader = false;
        this.notificationService.showError('Something went wrong!');
      }
    );
  }

  private generateRandomData(): number[] {
    return Array.from({ length: 7 }, () => Math.floor(Math.random() * 200) - 100);
  }

  randomizeData() {
    this.interactiveChartData.datasets.forEach(dataset => {
      dataset.data = this.generateRandomData();
    });
    this.chart2.update();
  }

  addDataset() {
    const newDataset = {
      label: 'Dataset ' + (this.interactiveChartData.datasets.length + 1),
      data: this.generateRandomData(),
      borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
      backgroundColor: `hsla(${Math.random() * 360}, 70%, 50%, 0.5)`,
    };
    this.interactiveChartData.datasets.push(newDataset);
    this.chart2.update();
  }

  removeDataset() {
    this.interactiveChartData.datasets.pop();
    this.chart2.update();
  }

  addData() {
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = this.interactiveChartData.labels as string[];
    const newMonth = months[labels.length - 7];
    if (newMonth) {
      labels.push(newMonth);
      this.interactiveChartData.datasets.forEach(dataset => {
        dataset.data.push(Math.floor(Math.random() * 200) - 100);
      });
      this.chart2.update();
    }
  }

  removeData() {
    if (this.interactiveChartData.labels) {
      this.interactiveChartData.labels.pop();
      this.interactiveChartData.datasets.forEach(dataset => {
        dataset.data.pop();
      });
      this.chart2.update();
    }
  }

  ngOnDestroy(): void {
    // Clean up chart instances on component destruction
    const canvas1 = document.getElementById('productivityChart') as HTMLCanvasElement;
    const existingChart1 = Chart.getChart(canvas1);
    if (existingChart1) {
      existingChart1.destroy();
    }

    const userHoursCanvas = document.getElementById('userHoursChart') as HTMLCanvasElement;
    const existingUserHoursChart = Chart.getChart(userHoursCanvas);
    if (existingUserHoursChart) {
      existingUserHoursChart.destroy();
    }

    const canvas2 = document.getElementById('productivityChart2') as HTMLCanvasElement;
    const existingChart2 = Chart.getChart(canvas2);
    if (existingChart2) {
      existingChart2.destroy();
    }
  }

  // Convert a formatted date label back to a YYYY-MM-DD date string
  convertLabelToDate(label: string): string {
    if (!label) return '';

    // Try to parse the date from label format (dd-MM-yyyy or dd/MM)
    let day: string, month: string, year: string;
    const currentYear = new Date().getFullYear().toString();

    try {
      if (label.includes('-')) {
        const parts = label.split('-');
        if (parts.length >= 2) {
          day = parts[0].padStart(2, '0');
          month = parts[1].padStart(2, '0');
          year = parts.length > 2 ? parts[2] : currentYear;
        } else {
          return '';
        }
      } else if (label.includes('/')) {
        const parts = label.split('/');
        if (parts.length >= 2) {
          day = parts[0].padStart(2, '0');
          month = parts[1].padStart(2, '0');
          year = parts.length > 2 ? parts[2] : currentYear;
        } else {
          return '';
        }
      } else {
        // Try to parse as a date object if it's in a different format
        const dateObj = new Date(label);
        if (!isNaN(dateObj.getTime())) {
          day = dateObj.getDate().toString().padStart(2, '0');
          month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
          year = dateObj.getFullYear().toString();
        } else {
          console.warn('Unable to parse date label:', label);
          return '';
        }
      }

      // Format properly, ensuring padding with leading zeros
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch (error) {
      console.error('Error parsing date label:', label, error);
      return '';
    }
  }

  // Find user ID by name
  findUserIdByName(userName: string): string {
    // First check selected users
    if (this.taskGraphData && this.taskGraphData.byUser) {
      for (const userData of this.taskGraphData.byUser) {
        if (userData.user && userData.user.name === userName) {
          return userData.user.id;
        }
      }
    }

    // Then check userList
    for (const user of this.userList) {
      if (user.userName === userName) {
        return user._id;
      }
    }

    return '';
  }

  // Show task details for a specific user and date
  showTaskDetailsForUserAndDate(userId: string, dateString: string) {
    if (!this.taskGraphData) {
      this.notificationService.showError('No task data available');
      return;
    }

    this.selectedTaskDetails = [];
    this.selectedDate = dateString;
    this.selectedUser = '';

    // Find the user name
    let userName = '';
    if (this.taskGraphData.byUser) {
      const userInfo = this.taskGraphData.byUser.find((u: any) => u.user && u.user.id === userId);
      if (userInfo && userInfo.user) {
        userName = userInfo.user.name || '';
        this.selectedUser = userName;
      }
    }

    if (!userName) {
      const userInfo = this.userList.find((u: any) => u._id === userId);
      if (userInfo) {
        userName = userInfo.userName || '';
        this.selectedUser = userName;
      }
    }

    // Filter tasks that have comments for this specific date
    if (this.taskGraphData.byUser) {
      const userData = this.taskGraphData.byUser.find((u: any) => u.user && u.user.id === userId);

      if (userData && userData.tasks && Array.isArray(userData.tasks)) {
        // Get all tasks for this user
        this.selectedTaskDetails = userData.tasks
          .filter((task: any) => {
            // Only include tasks that have comments for the selected date
            if (task.comments && Array.isArray(task.comments)) {
              return task.comments.some((comment: any) => {
                // Check if comment was made on the selected date
                if (comment.date) {
                  const commentDate = comment.date.split('T')[0];
                  return commentDate === dateString;
                }
                return false;
              });
            }
            return false;
          })
          .map((task: any) => {
            // Filter comments to only include those from the selected date
            const dateFilteredComments = task.comments ?
              task.comments.filter((c: any) => {
                if (c.date) {
                  const commentDate = c.date.split('T')[0];
                  return commentDate === dateString;
                }
                return false;
              }) : [];

            return {
              taskId: task.id,
              taskName: task.name,
              status: task.status,
              hours: task.totalHours || 0,
              comments: dateFilteredComments
            };
          });
      }
    }

    // Show the task details section
    this.showTaskDetails = this.selectedTaskDetails.length > 0;

    if (!this.showTaskDetails) {
      this.notificationService.showInfo(`No tasks found for ${userName} on ${this.formatDate(dateString)}`);
    }
  }

  // Format a comment date
  formatCommentDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  // Get user name by ID
  getUserName(userId: string): string {
    // First check taskGraphData
    if (this.taskGraphData && this.taskGraphData.byUser) {
      const userData = this.taskGraphData.byUser.find((u: any) =>
        u.user && (u.user.id === userId || u.user._id === userId)
      );

      if (userData && userData.user && userData.user.name) {
        return userData.user.name;
      }
    }

    // Then check userList
    const user = this.userList.find((u: any) => u._id === userId);
    if (user) {
      return user.userName || 'Unknown User';
    }

    return 'Unknown User';
  }

  // Get completed tasks count by user ID
  getUserCompletedTasks(userId: string): number {
    if (this.taskGraphData && this.taskGraphData.byUser) {
      const userData = this.taskGraphData.byUser.find((u: any) =>
        u.user && (u.user.id === userId || u.user._id === userId)
      );

      if (userData) {
        return userData.completedTasks || 0;
      }
    }

    return 0;
  }

  // Get pending tasks count by user ID
  getUserPendingTasks(userId: string): number {
    if (this.taskGraphData && this.taskGraphData.byUser) {
      const userData = this.taskGraphData.byUser.find((u: any) =>
        u.user && (u.user.id === userId || u.user._id === userId)
      );

      if (userData) {
        return userData.pendingTasks || 0;
      }
    }

    return 0;
  }

  // Get total hours by user ID
  getUserTotalHours(userId: string): number {
    if (this.taskGraphData && this.taskGraphData.byUser) {
      const userData = this.taskGraphData.byUser.find((u: any) =>
        u.user && (u.user.id === userId || u.user._id === userId)
      );

      if (userData) {
        const hours = userData.totalHours || 0;
        return this.convertHoursToHourMin(hours);
      }
    }

    return 0;
  }

  // Show tasks filtered by status for a specific user
  showTasksByStatus(userId: string, status: string): void {
    // Clear existing tasks
    this.tasksByStatus = [];

    // Hide any task details showing from chart clicks
    this.showTaskDetails = false;
    this.selectedTaskDetails = [];

    const userName = this.getUserName(userId);
    this.statusFilterTitle = `${status} Tasks for ${userName}`;

    // Show loading state
    this.showLoader = true;

    // Ensure dates are in YYYY-MM-DD format for API
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    // Prepare request parameters
    const params: any = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      userIds: userId
    };

    // Add status filter, converting to match API expectations
    if (status === 'Completed') {
      // Try both approaches to ensure compatibility
      params.status = 'complete';
      params.isCompleted = true;
    } else if (status === 'Pending') {
      params.status = 'pending';
      params.isPending = true;
    }

    console.log(`Fetching ${status} tasks for user ${userName} with params:`, params);

    // Call API with status filter
    this.superadminService.getTaskGraph(params).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status === true && response.data) {
          // Process tasks from the response
          this.processTasksResponse(response.data, userId, status);
        } else {
          this.notificationService.showError(response?.message || `Failed to fetch ${status} tasks`);
        }
      },
      (error) => {
        this.showLoader = false;
        this.notificationService.showError(`Failed to fetch ${status} tasks`);
      }
    );
  }

  // Process the task response data and extract tasks
  private processTasksResponse(data: any, userId: string, status: string): void {
    this.tasksByStatus = [];

    if (!data) {
      this.notificationService.showInfo(`No ${status} tasks found for this user.`);
      return;
    }

    // Try to find user data in different possible response formats
    let tasks: any[] = [];

    // Check for tasks in byUser format
    if (data.byUser && Array.isArray(data.byUser)) {
      const userData = data.byUser.find((u: any) =>
        u.user && (u.user.id === userId || u.user._id === userId)
      );

      if (userData && userData.tasks && Array.isArray(userData.tasks)) {
        tasks = userData.tasks;
      }
    }

    // If no tasks found in byUser, try direct tasks array
    if (tasks.length === 0 && data.tasks && Array.isArray(data.tasks)) {
      tasks = data.tasks;
    }

    // Filter tasks by status if needed
    if (tasks.length > 0) {
      this.tasksByStatus = tasks.filter((task: any) => {
        if (status === 'Completed') {
          // Primarily use isCompleted flag if available
          if (task.isCompleted !== undefined) {
            return task.isCompleted === true;
          }
          // Fallback to status field
          const taskStatus = (task.status || '').toLowerCase();
          return taskStatus === 'complete' || taskStatus === 'completed';
        } else if (status === 'Pending') {
          // Primarily use isPending flag if available
          if (task.isPending !== undefined) {
            return task.isPending === true;
          }
          // Otherwise check that isCompleted is false or status isn't complete
          if (task.isCompleted !== undefined) {
            return !task.isCompleted;
          }
          // Last fallback to status field
          const taskStatus = (task.status || '').toLowerCase();
          return taskStatus !== 'complete' && taskStatus !== 'completed';
        }
        return true;
      });
    }

    // Log result and show message if no tasks found
    console.log(`Found ${this.tasksByStatus.length} ${status} tasks for user ID ${userId}`);

    if (this.tasksByStatus.length === 0) {
      this.notificationService.showInfo(`No ${status} tasks found for this user.`);
    }
  }

  convertHoursToHourMin(hours: number): any {
    if (hours < 0 || isNaN(hours)) return 'Invalid input';

    const h = Math.floor(hours);
    const minutes = Math.round((hours - h) * 60);

    const hourPart = h > 0 ? `${h} Hour${h > 1 ? 's' : ''}` : '';
    const minutePart = minutes > 0 ? `${minutes} Min` : '';

    return [hourPart, minutePart].filter(Boolean).join(' ');
  }

  convertMinutesToHourMin(minutes: number): any {
    if (minutes < 0 || isNaN(minutes)) return 'Invalid input';

    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    const hourPart = h > 0 ? `${h} Hour${h > 1 ? 's' : ''}` : '';
    const minutePart = m > 0 ? `${m} Min` : '';

    return [hourPart, minutePart].filter(Boolean).join(' ');
  }
}
