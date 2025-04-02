import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { default as Annotation } from 'chartjs-plugin-annotation';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProjectManagerService } from 'src/app/services/project-manager/project-manager.service';

@Component({
  selector: 'app-team-productivity-view',
  templateUrl: './team-productivity-view.component.html',
  styleUrls: ['./team-productivity-view.component.scss']
})
export class TeamProductivityViewComponent implements OnInit, OnDestroy {
  showLoader: boolean = false;
  displayedUsers: any[] = [];
  loginUser: any;
  selectedUserIds: number[] = [];
  userList: any = [];
  showAll = false;

  public lineChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ],
    datasets: [{
      label: 'Productivity',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
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
        text: 'Resource Productivity Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Productivity Score'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month'
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

  constructor(
    private projectManagerService: ProjectManagerService,
    private notificationService: NotificationService,
    private localStorageService: LocalStorageService,
    private fb: FormBuilder
  ) {
    this.loginUser = this.localStorageService.getLogger();
    Chart.register(Annotation);
  }

  ngOnInit(): void {
    this.getUserAllList();
    // First chart
    const canvas1 = document.getElementById('teamProductivityChart') as HTMLCanvasElement;
    const existingChart1 = Chart.getChart(canvas1);
    if (existingChart1) {
      existingChart1.destroy();
    }
    const chart1 = new Chart(canvas1, {
      type: 'bar',
      data: this.lineChartData,
      options: this.lineChartOptions
    });

    // Second chart
    const canvas2 = document.getElementById('teamProductivityChart2') as HTMLCanvasElement;
    const existingChart2 = Chart.getChart(canvas2);
    if (existingChart2) {
      existingChart2.destroy();
    }
    this.chart2 = new Chart(canvas2, {
      type: 'bar',
      data: this.interactiveChartData,
      options: this.interactiveChartOptions
    });
  }

  ngOnDestroy(): void {
    const canvas1 = document.getElementById('teamProductivityChart') as HTMLCanvasElement;
    const existingChart1 = Chart.getChart(canvas1);
    if (existingChart1) {
      existingChart1.destroy();
    }

    const canvas2 = document.getElementById('teamProductivityChart2') as HTMLCanvasElement;
    const existingChart2 = Chart.getChart(canvas2);
    if (existingChart2) {
      existingChart2.destroy();
    }
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

  toggleView() {
    this.showAll = !this.showAll;
    this.displayedUsers = this.showAll ? this.userList : this.userList.slice(0, 7);
  }

  toggleUserSelection(userId: number): void {
    const index = this.selectedUserIds.indexOf(userId);
    if (index > -1) {
      this.selectedUserIds.splice(index, 1);
    } else {
      this.selectedUserIds.push(userId);
    }
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
}
