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
    // Format date to display as "dd-MM-yyyy" format
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    if (fullFormat) {
      return `${day}-${month}-${year}`;
    } else {
      // Shorter format for many dates
      return `${day}-${month}`;
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
      params.userIds = this.selectedUserIds.join(',');
    }

    this.superadminService.getTaskGraph(params).subscribe(
      (response) => {
        this.showLoader = false;
        if (response?.status === true) {
          // Process the 'byDate' data for the chart
          if (response.data && response.data.byDate) {
            // Get all dates in the selected range
            const allDatesInRange = this.getDatesInRange(formattedStartDate, formattedEndDate);
            const dateLabels: string[] = [];
            const hourValues: number[] = [];

            // Create a map of date to hours for quick lookup
            const dateToHoursMap = new Map();
            response.data.byDate.forEach((dateEntry: any) => {
              const dateKey = dateEntry.date.split('T')[0]; // Remove time part
              dateToHoursMap.set(dateKey, dateEntry.totalHours || 0);
            });

            // Determine if we need shorter date format based on number of dates
            const useShortFormat = allDatesInRange.length > 10;

            // Fill in data for all dates in range, using 0 for dates with no data
            allDatesInRange.forEach(date => {
              dateLabels.push(this.formatDate(date, !useShortFormat));
              const hours = dateToHoursMap.get(date) || 0;
              hourValues.push(hours);
            });

            // Update chart data
            this.lineChartData.labels = dateLabels;
            this.lineChartData.datasets = [{
              label: 'Hours',
              data: hourValues,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 1
            }];

            // Update chart options
            this.lineChartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Resource Productivity by Date',
                  font: {
                    size: 16
                  }
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `Hours: ${context.raw}`;
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
                  },
                  ticks: {
                    precision: 1
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
                    maxRotation: 90,
                    minRotation: 45,
                    autoSkip: true,
                    maxTicksLimit: 15,
                    font: {
                      size: 10
                    }
                  }
                }
              }
            };

            // Update the chart
            const canvas1 = document.getElementById('productivityChart') as HTMLCanvasElement;
            const existingChart1 = Chart.getChart(canvas1);
            if (existingChart1) {
              existingChart1.destroy();
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

    const canvas2 = document.getElementById('productivityChart2') as HTMLCanvasElement;
    const existingChart2 = Chart.getChart(canvas2);
    if (existingChart2) {
      existingChart2.destroy();
    }
  }
}
