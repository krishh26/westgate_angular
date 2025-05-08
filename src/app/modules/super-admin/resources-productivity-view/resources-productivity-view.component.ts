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
      this.getTaskGraphData();
    }
  }

  formatDate(dateString: string, fullFormat = true): string {
    // Format date to display as "dd-MM" or "dd-MM-yyyy" format
    const date = new Date(dateString);
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
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Set hours to ensure proper date comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Clone the start date to avoid modifying it
    let currentDate = new Date(start);

    // Loop until we reach the end date
    while (currentDate <= end) {
      dateArray.push(new Date(currentDate).toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  }

  getTaskGraphData() {
    this.showLoader = true;

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
          // Process the 'byDate' data for the chart
          if (response.data && response.data.byDate) {
            console.log('API Response data structure:', response.data);

            // Initialize map to store user-specific data by date
            const userDataMap = new Map<string, Map<string, number>>();
            const userDatasets: any[] = [];
            const selectedUserMap = new Map<string, string>(); // Map user IDs to names

            // If we have user-specific data directly, use it
            if (response.data.byUser && this.selectedUserIds.length > 0) {
              console.log('Found byUser data in API response');

              // Process user-specific data
              response.data.byUser.forEach((userData: any) => {
                if (userData.userId && this.selectedUserIds.includes(userData.userId)) {
                  if (!userDataMap.has(userData.userId)) {
                    userDataMap.set(userData.userId, new Map());
                  }

                  // Process all dates for this user
                  if (userData.dates && Array.isArray(userData.dates)) {
                    userData.dates.forEach((dateData: any) => {
                      if (dateData.date) {
                        const dateKey = dateData.date.split('T')[0];
                        userDataMap.get(userData.userId)?.set(dateKey, dateData.hours || 0);
                        console.log(`User ${userData.userId} has ${dateData.hours} hours on ${dateKey} (from byUser)`);
                      }
                    });
                  }
                }
              });
            }

            // Get all dates in the selected range
            const allDatesInRange = this.getDatesInRange(formattedStartDate, formattedEndDate);
            const dateLabels: string[] = [];

            // Create a map of date to hours for quick lookup
            const dateToHoursMap = new Map();
            const dateToUsersMap = new Map();

            // Get user names for the selected IDs
            if (this.selectedUserIds.length > 0) {
              console.log('Selected User IDs:', this.selectedUserIds);

              // Find user names from userList
              this.userList.forEach((user: any) => {
                if (this.selectedUserIds.includes(user._id)) {
                  selectedUserMap.set(user._id, user.userName);
                  console.log(`Mapped user ID ${user._id} to name ${user.userName}`);
                }
              });
            }

            response.data.byDate.forEach((dateEntry: any) => {
              const dateKey = dateEntry.date.split('T')[0]; // Remove time part
              dateToHoursMap.set(dateKey, dateEntry.totalHours || 0);

              // Store user names for each date if available
              if (dateEntry.users && dateEntry.users.length > 0) {
                // Filter out users with null/undefined/empty usernames
                const validUsers = dateEntry.users
                  .filter((user: any) => user && user.userName && typeof user.userName === 'string')
                  .map((user: any) => user.userName);

                if (validUsers.length > 0) {
                  dateToUsersMap.set(dateKey, validUsers.join(', '));
                } else {
                  dateToUsersMap.set(dateKey, '');
                }

                // Store user-specific data for this date
                if (this.selectedUserIds.length > 0) {
                  console.log(`Date ${dateKey} has ${dateEntry.users.length} users`);

                  dateEntry.users.forEach((user: any) => {
                    // Log the user object structure to debug
                    console.log('User data structure:', JSON.stringify(user));

                    // Extract userId - could be _id, userId, or id
                    const userId = user._id || user.userId || user.id;

                    if (userId && this.selectedUserIds.includes(userId)) {
                      // Initialize user data if not exists
                      if (!userDataMap.has(userId)) {
                        userDataMap.set(userId, new Map());
                      }

                      // Try to find hours in different possible properties
                      const userHours = user.hours || user.totalHours || user.productivity || 0;
                      userDataMap.get(userId)?.set(dateKey, userHours);

                      console.log(`User ${userId} has ${userHours} hours on ${dateKey}`);
                    }
                  });
                }
              } else {
                dateToUsersMap.set(dateKey, '');
              }
            });

            // Determine if we need shorter date format based on number of dates
            const useShortFormat = allDatesInRange.length > 10;

            // Fill in data for all dates in range for the total
            const hourValues: number[] = [];
            const userNames: string[] = [];

            allDatesInRange.forEach(date => {
              dateLabels.push(this.formatDate(date, !useShortFormat));
              const hours = dateToHoursMap.get(date) || 0;
              hourValues.push(hours);
              userNames.push(dateToUsersMap.get(date) || '');
            });

            // Create color array based on user presence
            const backgroundColors = hourValues.map(hours => {
              return hours > 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(220, 220, 220, 0.3)';
            });

            const borderColors = hourValues.map(hours => {
              return hours > 0 ? 'rgb(75, 192, 192)' : 'rgb(200, 200, 200)';
            });

            // Update chart data with user information
            const xAxisLabels = dateLabels.map((date, index) => {
              const username = userNames[index] || '';
              return {
                date: date,
                user: username
              };
            });

            // Prepare chart datasets
            let datasets: any[] = [];

            // If users are selected, create a dataset for each user
            if (this.selectedUserIds.length > 0) {
              // Generate colors for users
              const userColors = [
                { bg: 'rgba(75, 192, 192, 0.6)', border: 'rgb(75, 192, 192)' },
                { bg: 'rgba(255, 99, 132, 0.6)', border: 'rgb(255, 99, 132)' },
                { bg: 'rgba(54, 162, 235, 0.6)', border: 'rgb(54, 162, 235)' },
                { bg: 'rgba(255, 206, 86, 0.6)', border: 'rgb(255, 206, 86)' },
                { bg: 'rgba(153, 102, 255, 0.6)', border: 'rgb(153, 102, 255)' },
                { bg: 'rgba(255, 159, 64, 0.6)', border: 'rgb(255, 159, 64)' }
              ];

              // Create a dataset for each selected user
              this.selectedUserIds.forEach((userId, index) => {
                const userData: number[] = [];
                const color = userColors[index % userColors.length];
                const userName = selectedUserMap.get(userId) || userId;

                console.log(`Processing data for user ${userName} (${userId})`);

                allDatesInRange.forEach(date => {
                  const userDateMap = userDataMap.get(userId);
                  // Add a small value (0.1) to ensure bars are at least minimally visible
                  // This makes it easier to see which user has data on which date
                  const userHours = userDateMap ? (userDateMap.get(date) || 0.1) : 0.1;
                  userData.push(userHours);
                  console.log(`- Date ${date}: ${userHours} hours`);
                });

                datasets.push({
                  label: userName,
                  data: userData,
                  backgroundColor: color.bg,
                  borderColor: color.border,
                  borderWidth: 1,
                  borderRadius: 4,
                  barPercentage: 0.8,
                  categoryPercentage: 0.7  // For better grouped bar spacing
                });
              });
            } else {
              // Just use the total hours for all users
              datasets = [{
                label: 'Hours',
                data: hourValues,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
                borderRadius: 4,
                hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
                barPercentage: 0.9
              }];
            }

            // Update chart data
            this.lineChartData.labels = xAxisLabels.map(item => item.date);
            this.lineChartData.datasets = datasets;

            // Update chart options for grouped bars if necessary
            if (this.selectedUserIds.length > 0) {
              this.lineChartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: 'Resource Productivity by User & Date',
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
                        const index = tooltipItems[0].dataIndex;
                        return `Date: ${xAxisLabels[index].date}`;
                      },
                      label: (context) => {
                        const userName = context.dataset.label || '';
                        const hoursValue = context.raw as number;
                        // Display "-" if hours is essentially just the placeholder value
                        const hoursDisplay = hoursValue > 0.1 ? `${hoursValue.toFixed(1)} hours` : '-';
                        return `${userName}: ${hoursDisplay}`;
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
                    // Ensure minimum scale so tiny bars are visible
                    min: 0,
                    suggestedMax: 10
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
                      maxRotation: 90,
                      minRotation: 45,
                      autoSkip: true,
                      maxTicksLimit: 30,
                      font: {
                        size: 10
                      },
                      padding: 10
                    },
                    grid: {
                      display: true,
                      drawOnChartArea: false
                    }
                  }
                }
              };
            } else {
              // Update chart options for single dataset
              this.lineChartOptions = {
                responsive: true,
                maintainAspectRatio: false,
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
            }

            // Update the chart
            const canvas1 = document.getElementById('productivityChart') as HTMLCanvasElement;
            const existingChart1 = Chart.getChart(canvas1);
            if (existingChart1) {
              existingChart1.destroy();
            }

            // Determine the minimum width based on the number of data points
            const minWidth = Math.max(1200, allDatesInRange.length * 40);

            // Update the containing div's width
            const chartContainer = canvas1.parentElement;
            if (chartContainer) {
              chartContainer.style.minWidth = `${minWidth}px`;
            }

            const chart1 = new Chart(canvas1, {
              type: 'bar',
              data: this.lineChartData,
              options: this.lineChartOptions
            });
          }
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

    console.log('Creating user hours chart with userList length:', this.userList.length);

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
        console.log(`User ${user.userName} has ${count} tasks`);
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

    const index = this.selectedUserIds.indexOf(userId);
    if (index > -1) {
      this.selectedUserIds.splice(index, 1);
    } else {
      this.selectedUserIds.push(userId);
    }

    // Refresh the chart with the selected users
    this.getTaskGraphData();
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
}
