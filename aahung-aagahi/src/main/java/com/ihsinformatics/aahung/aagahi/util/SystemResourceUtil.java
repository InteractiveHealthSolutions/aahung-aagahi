/**
 * 
 */
package com.ihsinformatics.aahung.aagahi.util;

import java.io.File;
import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.util.OptionalDouble;
import java.util.Queue;
import java.util.concurrent.ArrayBlockingQueue;

import javax.management.Attribute;
import javax.management.AttributeList;
import javax.management.MBeanServer;
import javax.management.ObjectName;

import lombok.Getter;

/**
 * @author owais.hussain@ihsinformatics.com
 *
 */
public class SystemResourceUtil {

	public static final int BYTES_IN_ONE_GB = 1073741824;

	public static final int HISTORY_SIZE = 600;

	private Queue<Float> diskHistory;

	private Queue<Float> memoryHistory;

	private Queue<Float> cpuHistory;

	@Getter
	private static SystemResourceUtil instance = new SystemResourceUtil();

	// This has to be a singleton
	private SystemResourceUtil() {
		diskHistory = memoryHistory = cpuHistory = new ArrayBlockingQueue<>(HISTORY_SIZE);
	}

	public int getCurrentHistorySize() {
		return diskHistory.size();
	}

	/**
	 * Fetch resources and store in history. If the HISTORY_SIZE limit is reached,
	 * the first item from each queue is removed before entering new value
	 */
	public void noteReadings() {
		if (diskHistory.size() >= HISTORY_SIZE) {
			diskHistory.remove();
		}
		diskHistory.add(getDiskAvailabilityPercentage());
		if (memoryHistory.size() >= HISTORY_SIZE) {
			memoryHistory.remove();
		}
		memoryHistory.add(getProcessorAvailabilityPercentage());
		if (cpuHistory.size() >= HISTORY_SIZE) {
			cpuHistory.remove();
		}
		cpuHistory.add(getProcessorAvailabilityPercentage());
	}

	/**
	 * Resets all history
	 */
	public void clearHistory() {
		diskHistory.clear();
		memoryHistory.clear();
		cpuHistory.clear();
	}

	/**
	 * Returns percentage of available disk space
	 * 
	 * @return
	 */
	public float getDiskAvailabilityPercentage() {
		float max = (float) new File("/").getTotalSpace() / BYTES_IN_ONE_GB;
		float used = max - (float) new File("/").getFreeSpace() / BYTES_IN_ONE_GB;
		return (max - used) * 100 / max;
	}

	/**
	 * Returns percentage of available memory
	 * 
	 * @return
	 */
	public float getMemoryAvailabilityPercentage() {
		MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
		float max = (float) memoryMXBean.getHeapMemoryUsage().getMax() / BYTES_IN_ONE_GB;
		float used = (float) memoryMXBean.getHeapMemoryUsage().getUsed() / BYTES_IN_ONE_GB;
		return (max - used) * 100 / max;
	}

	/**
	 * Returns percentage of available CPU resources
	 * 
	 * @return
	 */
	public float getProcessorAvailabilityPercentage() {
		try {
			MBeanServer mbs = ManagementFactory.getPlatformMBeanServer();
			ObjectName name = ObjectName.getInstance("java.lang:type=OperatingSystem");
			AttributeList list = mbs.getAttributes(name, new String[] { "ProcessCpuLoad" });
			if (list.isEmpty()) {
				return -1f;
			}
			Attribute att = (Attribute) list.get(0);
			Double value = (Double) att.getValue();
			if (value == -1.0) {
				return -1f;
			}
			return 100 - (float) ((int) (value * 1000) / 10.0);
		} catch (Exception e) {
			return -1f;
		}
	}

	/**
	 * Returns percentage of available disk space
	 * 
	 * @return
	 */
	public float getAverageDiskAvailabilityPercentage() {
		OptionalDouble average = diskHistory.stream().mapToDouble(i -> i).average();
		return (float) (average.isPresent() ? average.getAsDouble() : 0);
	}

	/**
	 * Returns percentage of available memory
	 * 
	 * @return
	 */
	public float getAverageMemoryAvailabilityPercentage() {
		OptionalDouble average = memoryHistory.stream().mapToDouble(i -> i).average();
		return (float) (average.isPresent() ? average.getAsDouble() : 0);
	}

	/**
	 * Returns percentage of available CPU resources
	 * 
	 * @return
	 */
	public float getAverageProcessorAvailabilityPercentage() {
		OptionalDouble average = cpuHistory.stream().mapToDouble(i -> i).average();
		return (float) (average.isPresent() ? average.getAsDouble() : 0);
	}
}